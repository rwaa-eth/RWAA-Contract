<script lang="ts">
	import context from '../lib/context';
	import Loader from '../components/Loader.svelte';
	import { initialize, getKeyringFromSeed } from 'avail-js-sdk';
	import config from '../config/config';
	import CryptoJS from 'crypto-js';
	import { RWAAContract } from '../lib/contract';
	import { decodeBase64, ethers } from 'ethers';
	import { TokenType } from '@tokenscript/card-sdk/src/types/tokenData';

	let token: TokenType;
	let encryptedDocContent: string | null = null;
	let decryptedDocContent: string | null = null;
	let blockHash: string | null = null;
	let txHash: string | null = null;
	let docName: string | null = null;
	let docId: string | null = null;
	let loading = true;

	const rwaContract = new RWAAContract();

	/**
	 * Retrieves data from Avail blockchain using transaction and block hashes.
	 * @param {string} txHash - The transaction hash.
	 * @param {string} blockHash - The block hash.
	 * @returns {Promise<string>} The decoded data string extracted from the transaction.
	 */
	const retrieveFromAvail = async (txHash: string, blockHash: string) => {
		// Initialize the Avail API and retrieve the account from seed
		const api = await initialize(config.endpoint);
		const account = getKeyringFromSeed(config.seed);
		console.log('Account initialized:', account);

		// Log transaction details
		console.log(`Transaction Hash: ${txHash}, Block Hash: ${blockHash}`);

		// Fetch the block using the block hash
		const block = await api.rpc.chain.getBlock(blockHash);
		console.log('Block details:', block);

		// Find the specific transaction in the block's extrinsics
		const tx = block.block.extrinsics.find((extrinsic) => extrinsic.hash.toHex() === txHash);
		console.log('Transaction details:', tx);

		// Handle case where transaction is not found
		if (!tx) {
			console.error('Failed to find the Submit Data transaction');
			process.exit(1);
		}

		// Decode the data from the transaction
		const dataAsString = new TextDecoder().decode(new Uint8Array(tx.data));
		console.log('Decoded data:', dataAsString);

		// Convert the transaction method arguments from hex to string
		const dataHex = tx.method.args.map((arg) => arg.toString()).join(', ');
		let decodedString = '';
		for (let n = 0; n < dataHex.length; n += 2) {
			decodedString += String.fromCharCode(parseInt(dataHex.substring(n, n + 2), 16));
		}
		console.log(`Submitted data: ${decodedString}`);

		return decodedString;
	};

	context.data.subscribe(async (value) => {
		if (!value.token) return;
		token = value.token;

		console.log('token', token);
		// You can load other data before hiding the loader
		loading = true;
		console.log('Load Avail 1');
		// @ts-ignore
		docId = token.customTokenInfo.docId;
		if (!docId) {
			throw new Error('Invalid document metadata');
		}
		try {
			const availDocMetadata = await rwaContract.getAvailDocMetadataByDocId(parseInt(docId));
			console.log('availDocMetadata', availDocMetadata);
			[blockHash, txHash, docName] = availDocMetadata;

			if (!blockHash || !txHash || !docName) {
				throw new Error('Invalid document metadata');
			}
			const data = await retrieveFromAvail(blockHash, txHash);
			console.log('data', data);
			encryptedDocContent = data.toString();
		} catch (error) {
			console.log('error', error);
		}
		loading = false;
	});

	const decrypt = async () => {
		loading = true;

		const { data: challenge } = await fetch('https://ra.ath.cx/challenge').then((res) =>
			res.json()
		);
		console.log('challenge', challenge);
		console.log('tokenscript', tokenscript);
		console.log('token', token);

		tokenscript.personal.sign({ data: challenge }, async (error, sig) => {
			if (error) {
				console.log('error', error);
				return null;
			}
			console.log('personal.sign data', sig);
			const { data: aesKey } = await fetch('https://ra.ath.cx/verify', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				// @ts-ignore
				body: JSON.stringify({ signature: sig, tokenId: token.tokenId })
			}).then((res) => res.json());

			console.log('verify aesKey', aesKey);
			console.log('encryptedDocContent', encryptedDocContent);
			if (!encryptedDocContent) {
				alert('No encrypted document content found');
				return;
			}
			encryptedDocContent = encryptedDocContent.replace(/^\x00+/, '');
			console.log('Cleaned encryptedDocContent:', encryptedDocContent);
			debugger;
			const decryptedContent = CryptoJS.AES.decrypt(encryptedDocContent, aesKey).toString(
				CryptoJS.enc.Utf8
			);
			console.log('Decrypted Content:', decryptedContent);
			decryptedDocContent = decryptedContent;
		});
		loading = false;
	};
</script>

<div>
	{#if docName}
		<h2>Document: {docName}</h2>
		<h3>ID: {docId}</h3>
	{/if}
	{#if encryptedDocContent}
		<div style="text-align: center; display: flex; flex-direction: column; align-items: center;">
			<h3>Here is the content</h3>
			<p>encryptedDocContent: {encryptedDocContent.slice(0, 15) + '...'}</p>
			<p>blockHash: {blockHash?.slice(0, 10) + '...'}</p>
			<a href={`https://explorer.avail.so/#/explorer/query/${blockHash}`} target="_blank"
				>See on Explorer</a
			>
			<p>txHash: {txHash?.slice(0, 10) + '...'}</p>
			<a href={`https://explorer.avail.so/#/explorer/query/${txHash}`} target="_blank"
				>See on Explorer</a
			>
			<br />
			<button on:click={decrypt}>Decrypt</button>
			{#if decryptedDocContent}
				<div>
					<h3>Decrypted Content:</h3>
					<p>{decryptedDocContent}</p>
				</div>
			{/if}
		</div>
	{/if}
	<Loader show={loading} />
</div>

<script lang="ts">
	import context from '../lib/context';
	import Loader from '../components/Loader.svelte';
	import { initialize, getKeyringFromSeed } from 'avail-js-sdk';
	import config from '../config/config';
	import CryptoJS from 'crypto-js';
	import { RWAAContract } from '../lib/contract';
	import { TokenType } from '@tokenscript/card-sdk/src/types/tokenData';

	let token: TokenType;
	let loading = true;
	let uploadStatus: string | null = null;
	let documentContent: string | null = null;
	let documentName: string | null = null;
	const rwaContract = new RWAAContract();

	const aesEncrypt = (documentContent: string, secretKey: string) => {
		var ciphertext = CryptoJS.AES.encrypt(documentContent, secretKey).toString();
		console.log('ciphertext', ciphertext);
		return ciphertext;
	};

	// useEffect
	context.data.subscribe(async (value) => {
		if (!value.token) return;
		token = value.token;
		console.log('token', token);
		// You can load other data before hiding the loader
		loading = false;
	});

	const storeToAvail = async (encryptedDocument: string) => {
		tokenscript.action.showMessageToast(
			'info',
			'Storing in progress',
			'Storing your encrypted document to Avail'
		);

		console.log(`Storing ${encryptedDocument} to Avail`);
		const api = await initialize(config.endpoint);
		const account = getKeyringFromSeed(config.seed);
		console.log('account', account);
		const appId = config.appId === 0 ? 1 : config.appId;
		const options = { app_id: appId, nonce: -1 };

		// Transaction call
		// Change "Hello World" to something that has meaning to you
		const txResult = (await new Promise((res) => {
			api.tx.dataAvailability
				.submitData(encryptedDocument)
				.signAndSend(account, options, (result) => {
					console.log(`Tx status: ${result.status}`);
					if (result.isFinalized || result.isError) {
						res(result);
					}
				});
		})) as any;

		console.log('Done Storing to Avail');

		// Rejected Transaction handling
		if (txResult.isError) {
			console.log(`Transaction was not executed`);
			process.exit(1);
		}

		const [txHash, blockHash] = [txResult.txHash, txResult.status.asFinalized];
		// const [txHash, blockHash]["0x6882d80353beda0c8e61b75704ad519259f2b78077450e005697e4d6f4a9af3a", "0x440f98e257a72ff4cd9034f00520fdcabd14f7dabb3e08313e8bcacf07c5054d"]

		console.log(`Tx Hash: ${txHash}, Block Hash: ${blockHash}`);
		tokenscript.action.showMessageToast(
			'success',
			'Storing Done',
			`Your encrypted document is stored on Avail https://explorer.avail.so/#/explorer/query/${blockHash}`
		);
		return [txHash, blockHash];
	};

	// @ts-ignore
	window.onConfirm = async () => {
		if (!documentContent || !documentName) return;

		// loading = true;
		tokenscript.action.showLoader();

		uploadStatus = 'Initializing...';

		console.log('Confirm');
		const aesKey = CryptoJS.lib.WordArray.random(20).toString();
		console.log('aesKey', aesKey);
		const encryptedDocument = aesEncrypt(documentContent, aesKey);
		console.log('encryptedDocument', encryptedDocument);
		uploadStatus = 'Encrypting Document and storing on Avail...';
		const [txHash, blockHash] = await storeToAvail(encryptedDocument);
		uploadStatus = 'Done storing on Avail and minting NFT...';

		tokenscript.action.showMessageToast(
			'info',
			'Minting NFT',
			`Minting NFT for your ownership of document ${documentName}`
		);
		// Transaction Hash: 0xd330f03cb99e5779842c45e7849dc37e3e0b0435a7db6c73f920b87d93e77544, Block Hash: 0xfe8eab58ea86b5ac52dc78501a0ba9a7407e1b1a0c5536b5d89d6a9cd18ca1a2

		const docId = await rwaContract.createDocumentToken(
			txHash,
			blockHash,
			// '0xd330f03cb99e5779842c45e7849dc37e3e0b0435a7db6c73f920b87d93e77544',
			// '0xfe8eab58ea86b5ac52dc78501a0ba9a7407e1b1a0c5536b5d89d6a9cd18ca1a2',
			documentName
		);

		console.log('docId', docId);

		try {
			const response = await fetch('https://ra.ath.cx/register-key', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					docId: docId.toString(),
					aesKey: aesKey
				})
			});
			if (!response.ok) {
				throw new Error('Failed to register key');
			}
			const responseData = await response.json();
			console.log('Key registration response:', responseData);

			tokenscript.action.showMessageToast(
				'success',
				'Minting NFT Done',
				`NFT minted for your document ${documentName}`
			);
		} catch (error) {
			console.error('Error registering key:', error);
		}

		documentContent = null;
		documentName = null;
		// loading = false;
		uploadStatus = 'Done';
		tokenscript.action.hideLoader();
	};
</script>

<div>
	<div style="display: flex; flex-direction: column; align-items: center; gap: 15px;">
		<h2>Upload and Create a Document 📃</h2>
		<input
			type="text"
			bind:value={documentName}
			placeholder="Document Name"
			style="width: 100%; padding: 10px; border-radius: 5px; border: 1px solid #ccc;"
		/>
		<textarea
			bind:value={documentContent}
			placeholder="Document Content"
			style="width: 100%; height: 150px; padding: 10px; border-radius: 5px; border: 1px solid #ccc;"
		/>
	</div>
	{#if uploadStatus}
		<div style="text-align: center;">
			<h3>Status:</h3>
			<p>
				{uploadStatus}
			</p>
		</div>
	{/if}

	<Loader show={loading} />
</div>

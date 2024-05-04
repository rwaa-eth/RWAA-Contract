<script lang="ts">
	import context from '../lib/context';
	import Loader from '../components/Loader.svelte';
	import { initialize, getKeyringFromSeed } from 'avail-js-sdk';
	import config from '../config/config';
	import CryptoJS from 'crypto-js';
	import { RWAAContract } from '../lib/contract';
	import { ethers } from 'ethers';

	let token: any;
	let loading = true;
	let readableAddresses: { tokenId: number; ownerAddress: string }[] = [];

	const rwaContract = new RWAAContract();

	context.data.subscribe(async (value) => {
		if (!value.token) return;
		console.log('value', value);
		token = value.token;
		// You can load other data before hiding the loader

		const { readbleTokenIds } = token.customTokenInfo;

		for (const tokenId of Object.values(readbleTokenIds)) {
			try {
				const ownerAddress = await rwaContract.getOwnerOfByTokenId(parseInt(tokenId as string));
				if (!!ownerAddress) {
					readableAddresses.push({ tokenId: parseInt(tokenId as string), ownerAddress });
					console.log(`Token ID ${tokenId} is owned by ${ownerAddress}`);
				}
			} catch (error) {
				console.error(`Failed to get owner of token ID ${tokenId}:`, error);
			}
		}

		console.log('readableAddresses', readableAddresses);
		readableAddresses = readableAddresses;
		loading = false;
	});

	const cancelOwnership = async (tokenId: number) => {
		console.log('cancelOwnership', tokenId);
		tokenscript.action.showLoader();
		await rwaContract.revokeAndBurnReadalbeDocumentToken(tokenId);
		tokenscript.action.hideLoader();
	};

	// @ts-ignore
	window.onConfirm = async () => {
		loading = true;

		loading = false;
	};
</script>

<div style="margin: 20px;">
	<!-- {#if token}
		<div style="text-align: center;">
			<h3>Welcome to TokenScript</h3>
			<p>
				When a card loads in TokenScript, it gets access to the token context data through
				TokenScript engine
			</p>
		</div>
		<pre>{JSON.stringify(token, null, 2)}</pre>
	{/if} -->
	<!-- <pre>{JSON.stringify(readableAddresses, null, 2)}</pre> -->

	{#if readableAddresses.length > 0}
		<div style="display: flex; justify-content: center; margin: 20px;">
			<table style="margin: 20px; width: auto; max-width: 90%;">
				<tr>
					<th>Index</th>
					<th>Address</th>
					<th>Action</th>
				</tr>
				{#each readableAddresses as address, index}
					<tr>
						<td>{index + 1}</td>
						<td>{address.ownerAddress.slice(0, 6) + '...' + address.ownerAddress.slice(-4)}</td>
						<td><button on:click={() => cancelOwnership(address.tokenId)}>Revoke</button></td>
					</tr>
				{/each}
			</table>
		</div>
	{/if}

	<Loader show={loading} />
</div>

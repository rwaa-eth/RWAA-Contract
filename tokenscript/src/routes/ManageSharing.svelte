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
		<div style="display: flex; flex-direction: column; align-items: center; margin: 20px;">
			<h2 style="font-size: 24px; color: #333; font-weight: bold; text-align: center;">
				🔗 Share Access
			</h2>
			<p style="font-size: 16px; color: #666;  text-align: center;">
				See who you've shared your document with and manage access.
			</p>
			<table style="width: 90%; border-collapse: collapse; margin-top: 20px;">
				<tr style="background-color: #eee; color: block; text-align: center; font-weight: 300; ">
					<th style="font-weight: 300; ">🔢 Index</th>
					<th style="font-weight: 300; ">🏠 Address</th>
					<th style="font-weight: 300; ">🛠️ Action</th>
				</tr>
				{#each readableAddresses as address, index}
					<tr style="border-bottom: 1px solid #ddd;">
						<td style="padding: 8px; text-align: center;">{index + 1}</td>
						<td style="padding: 8px; text-align: center;"
							>{address.ownerAddress.slice(0, 6) + '...' + address.ownerAddress.slice(-4)}</td
						>
						<td style="padding: 8px; text-align: center;"
							><button
								on:click={() => cancelOwnership(address.tokenId)}
								style="padding: 5px 10px; border-radius: 5px; background-color: #f44336; color: white; border: none; cursor: pointer;"
								>🚫 Revoke</button
							></td
						>
					</tr>
				{/each}
			</table>
		</div>
	{:else}
		<div style="text-align: center; margin: 20px; font-size: 16px; color: #666;">
			<p>🔗 <strong>No shares yet!</strong> Head back and click <em>Share</em> to start sharing.</p>
		</div>
	{/if}

	<Loader show={loading} />
</div>

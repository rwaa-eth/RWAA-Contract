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
	let shareAddress: string | null = null;
	const rwaContract = new RWAAContract();

	context.data.subscribe(async (value) => {
		if (!value.token) return;
		console.log('value', value);
		token = value.token;
		// You can load other data before hiding the loader
		loading = false;
	});

	// @ts-ignore
	window.onConfirm = async () => {
		if (!shareAddress || !ethers.isAddress(shareAddress)) {
			alert('Invalid or empty Share Address');
			return;
		}

		if (!token.customTokenInfo.docId) {
			alert('No docId found');
			return;
		}

		const { docId } = token.customTokenInfo;
		console.log('docId', docId);

		tokenscript.action.showLoader();

		tokenscript.action.showMessageToast(
			'info',
			'Sharing in progress',
			'Sharing your private document'
		);
		await rwaContract.createReadalbeDocumentToken(Number(docId), shareAddress);

		tokenscript.action.showMessageToast(
			'success',
			'Share Done',
			'Your private document is shared with the share address'
		);

		tokenscript.action.hideLoader();
	};
</script>

<div>
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
	<div style="display: flex; flex-direction: column; align-items: center; margin-top: 20px;">
		<h2 style="font-size: 24px; color: #333; font-weight: bold; text-align: center;">
			📤 Enter Share Address
		</h2>
		<p style="font-size: 16px; color: #666; text-align: center;">
			👉 Please provide the address to share your document with.
		</p>
		<input
			type="text"
			bind:value={shareAddress}
			placeholder="🏠 Share Address"
			style="padding: 15px; width: 80%; font-size: 16px; border-radius: 8px; border: 1px solid #ccc; margin-top: 10px;"
		/>
	</div>
	<div />
	<Loader show={loading} />
</div>

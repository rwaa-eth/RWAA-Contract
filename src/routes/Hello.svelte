<script lang="ts">
	import context from '../lib/context';
	import Loader from '../components/Loader.svelte';
	import { initialize, getKeyringFromSeed } from 'avail-js-sdk';
	import config from '../config/config';
	let token;
	let loading = true;

	context.data.subscribe(async (value) => {
		if (!value.token) return;
		token = value.token;
		// You can load other data before hiding the loader
		loading = false;
		console.log('Store to Avail 1');
		
	});

	// @ts-ignore
	window.onConfirm = () => {
		console.log('Confirm');
		storeToAvail();
	};

	const storeToAvail = async () => {
		console.log('Storing to Avail 2');
		const api = await initialize(config.endpoint);
		const account = getKeyringFromSeed(config.seed);
		console.log("account", account)
		const appId = config.appId === 0 ? 1 : config.appId;
		const options = { app_id: appId, nonce: -1 };

		// Transaction call
		// Change "Hello World" to something that has meaning to you
		const data = 'Hello World';
		const txResult = await new Promise((res) => {
			api.tx.dataAvailability.submitData(data).signAndSend(account, options, (result) => {
				console.log(`Tx status: ${result.status}`);
				if (result.isFinalized || result.isError) {
					res(result);
				}
			});
		});
		console.log('Done Storing to Avail');
	};
</script>

<div>
	{#if token}
		<div style="text-align: center;">
			<h3>Welcome to TokenScript</h3>
			<p>
				When a card loads in TokenScript, it gets access to the token context data through
				TokenScript engine
			</p>
		</div>
		<pre>{JSON.stringify(token, null, 2)}</pre>
	{/if}
	<Loader show={loading} />
</div>

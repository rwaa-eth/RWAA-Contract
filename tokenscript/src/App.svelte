<script lang="ts">
	import context from './lib/context';
	import NotFound from './routes/NotFound.svelte';

	import CreateDocument from './routes/CreateDocument.svelte';
	import Share from './routes/Share.svelte';
	import ManageSharing from './routes/ManageSharing.svelte';
	import View from './routes/View.svelte';

	let token;
	let initialised = false;

	const routingMap = {
		'#info': View,
		'#share': Share,
		'#manage-sharing': ManageSharing,
		'#create-document': CreateDocument
	};

	let page;

	function routeChange() {
		page = routingMap[token.level == 0 ? '#adopt' : document.location.hash] || NotFound;
	}

	// @ts-ignore
	web3.tokens.dataChanged = async (oldTokens, updatedTokens, cardId) => {
		if (initialised) return;

		context.setToken(updatedTokens.currentInstance);
		token = updatedTokens.currentInstance;

		initialised = true;

		routeChange();
	};
</script>

<svelte:window on:hashchange={routeChange} />

<div>
	<div id="token-container">
		<svelte:component this={page} />
	</div>
</div>

<script lang="ts">
	// Importing the context module to access shared data across components
	import context from "../lib/context";
	// Importing the Loader component to show loading state
	import Loader from "../components/Loader.svelte";

	// Declare a variable to store the token data
	let token;
	// Declare a variable to control the visibility of the Loader component
	let loading = true;

	// Subscribe to the data stream from the context
	context.data.subscribe(async (value) => {
		// If there is no token in the received value, exit the function
		if (!value.token)
			return;
		// Assign the token from the received value to the local variable
		token = value.token;
		// You can load other data here before hiding the loader
		// Set loading to false to hide the Loader component as data is now loaded
		loading = false;
	});

	// @ts-ignore
	window.onConfirm = () => {
		console.log("Confirm")
	}

</script>

<div>
	{#if token} <!-- Check if token exists -->
		<div style="text-align: center;">
			<h3>Welcome to TokenScript</h3>
			<p>When a card loads in TokenScript, it gets access to the token context data through TokenScript engine</p>
		</div>
		<pre>{JSON.stringify(token, null, 2)}</pre> <!-- Display the token data in a formatted way -->
	{/if}
	<Loader show={loading}/> <!-- Show or hide the Loader based on the 'loading' variable -->
</div>

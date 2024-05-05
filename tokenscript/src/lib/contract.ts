import {
	BrowserProvider,
	Contract,
	ContractTransactionResponse,
	EventLog,
	JsonRpcProvider,
	Network
} from 'ethers';

export class RWAAContract {
	private static CONTRACT_ADDR = '0xefAB18061C57C458c52661f50f5b83B600392ed6';
	private static CONTRACT_ABI = [
		{
			inputs: [
				{
					internalType: 'address',
					name: 'to',
					type: 'address'
				},
				{
					internalType: 'uint256',
					name: 'tokenId',
					type: 'uint256'
				}
			],
			name: 'approve',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [
				{
					components: [
						{
							internalType: 'bytes32',
							name: 'blockHash',
							type: 'bytes32'
						},
						{
							internalType: 'bytes32',
							name: 'txHash',
							type: 'bytes32'
						},
						{
							internalType: 'string',
							name: 'name',
							type: 'string'
						}
					],
					internalType: 'struct RWAAV1.AvailDocMetadata',
					name: 'availDocMetadata',
					type: 'tuple'
				}
			],
			name: 'createDocument',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [
				{
					internalType: 'uint256',
					name: 'docId',
					type: 'uint256'
				},
				{
					internalType: 'address',
					name: 'toAddress',
					type: 'address'
				}
			],
			name: 'createReadableToken',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [
				{
					internalType: 'address',
					name: 'initialOwner',
					type: 'address'
				}
			],
			stateMutability: 'nonpayable',
			type: 'constructor'
		},
		{
			inputs: [],
			name: 'ERC721EnumerableForbiddenBatchMint',
			type: 'error'
		},
		{
			inputs: [
				{
					internalType: 'address',
					name: 'sender',
					type: 'address'
				},
				{
					internalType: 'uint256',
					name: 'tokenId',
					type: 'uint256'
				},
				{
					internalType: 'address',
					name: 'owner',
					type: 'address'
				}
			],
			name: 'ERC721IncorrectOwner',
			type: 'error'
		},
		{
			inputs: [
				{
					internalType: 'address',
					name: 'operator',
					type: 'address'
				},
				{
					internalType: 'uint256',
					name: 'tokenId',
					type: 'uint256'
				}
			],
			name: 'ERC721InsufficientApproval',
			type: 'error'
		},
		{
			inputs: [
				{
					internalType: 'address',
					name: 'approver',
					type: 'address'
				}
			],
			name: 'ERC721InvalidApprover',
			type: 'error'
		},
		{
			inputs: [
				{
					internalType: 'address',
					name: 'operator',
					type: 'address'
				}
			],
			name: 'ERC721InvalidOperator',
			type: 'error'
		},
		{
			inputs: [
				{
					internalType: 'address',
					name: 'owner',
					type: 'address'
				}
			],
			name: 'ERC721InvalidOwner',
			type: 'error'
		},
		{
			inputs: [
				{
					internalType: 'address',
					name: 'receiver',
					type: 'address'
				}
			],
			name: 'ERC721InvalidReceiver',
			type: 'error'
		},
		{
			inputs: [
				{
					internalType: 'address',
					name: 'sender',
					type: 'address'
				}
			],
			name: 'ERC721InvalidSender',
			type: 'error'
		},
		{
			inputs: [
				{
					internalType: 'uint256',
					name: 'tokenId',
					type: 'uint256'
				}
			],
			name: 'ERC721NonexistentToken',
			type: 'error'
		},
		{
			inputs: [
				{
					internalType: 'address',
					name: 'owner',
					type: 'address'
				},
				{
					internalType: 'uint256',
					name: 'index',
					type: 'uint256'
				}
			],
			name: 'ERC721OutOfBoundsIndex',
			type: 'error'
		},
		{
			inputs: [
				{
					internalType: 'address',
					name: 'owner',
					type: 'address'
				}
			],
			name: 'OwnableInvalidOwner',
			type: 'error'
		},
		{
			inputs: [
				{
					internalType: 'address',
					name: 'account',
					type: 'address'
				}
			],
			name: 'OwnableUnauthorizedAccount',
			type: 'error'
		},
		{
			anonymous: false,
			inputs: [
				{
					indexed: true,
					internalType: 'address',
					name: 'owner',
					type: 'address'
				},
				{
					indexed: true,
					internalType: 'address',
					name: 'approved',
					type: 'address'
				},
				{
					indexed: true,
					internalType: 'uint256',
					name: 'tokenId',
					type: 'uint256'
				}
			],
			name: 'Approval',
			type: 'event'
		},
		{
			anonymous: false,
			inputs: [
				{
					indexed: true,
					internalType: 'address',
					name: 'owner',
					type: 'address'
				},
				{
					indexed: true,
					internalType: 'address',
					name: 'operator',
					type: 'address'
				},
				{
					indexed: false,
					internalType: 'bool',
					name: 'approved',
					type: 'bool'
				}
			],
			name: 'ApprovalForAll',
			type: 'event'
		},
		{
			anonymous: false,
			inputs: [
				{
					indexed: false,
					internalType: 'uint256',
					name: 'docId',
					type: 'uint256'
				}
			],
			name: 'DocumentCreated',
			type: 'event'
		},
		{
			anonymous: false,
			inputs: [
				{
					indexed: true,
					internalType: 'address',
					name: 'previousOwner',
					type: 'address'
				},
				{
					indexed: true,
					internalType: 'address',
					name: 'newOwner',
					type: 'address'
				}
			],
			name: 'OwnershipTransferred',
			type: 'event'
		},
		{
			inputs: [],
			name: 'renounceOwnership',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [
				{
					internalType: 'uint256',
					name: 'tokenId',
					type: 'uint256'
				}
			],
			name: 'revokeReadableToken',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [
				{
					internalType: 'address',
					name: 'from',
					type: 'address'
				},
				{
					internalType: 'address',
					name: 'to',
					type: 'address'
				},
				{
					internalType: 'uint256',
					name: 'tokenId',
					type: 'uint256'
				}
			],
			name: 'safeTransferFrom',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [
				{
					internalType: 'address',
					name: 'from',
					type: 'address'
				},
				{
					internalType: 'address',
					name: 'to',
					type: 'address'
				},
				{
					internalType: 'uint256',
					name: 'tokenId',
					type: 'uint256'
				},
				{
					internalType: 'bytes',
					name: 'data',
					type: 'bytes'
				}
			],
			name: 'safeTransferFrom',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			anonymous: false,
			inputs: [
				{
					indexed: false,
					internalType: 'string[]',
					name: '',
					type: 'string[]'
				}
			],
			name: 'ScriptUpdate',
			type: 'event'
		},
		{
			inputs: [
				{
					internalType: 'address',
					name: 'operator',
					type: 'address'
				},
				{
					internalType: 'bool',
					name: 'approved',
					type: 'bool'
				}
			],
			name: 'setApprovalForAll',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [
				{
					internalType: 'string[]',
					name: 'newScriptURI',
					type: 'string[]'
				}
			],
			name: 'setScriptURI',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			anonymous: false,
			inputs: [
				{
					indexed: true,
					internalType: 'address',
					name: 'from',
					type: 'address'
				},
				{
					indexed: true,
					internalType: 'address',
					name: 'to',
					type: 'address'
				},
				{
					indexed: true,
					internalType: 'uint256',
					name: 'tokenId',
					type: 'uint256'
				}
			],
			name: 'Transfer',
			type: 'event'
		},
		{
			inputs: [
				{
					internalType: 'address',
					name: 'from',
					type: 'address'
				},
				{
					internalType: 'address',
					name: 'to',
					type: 'address'
				},
				{
					internalType: 'uint256',
					name: 'tokenId',
					type: 'uint256'
				}
			],
			name: 'transferFrom',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [
				{
					internalType: 'address',
					name: 'newOwner',
					type: 'address'
				}
			],
			name: 'transferOwnership',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [],
			name: '_nextDocId',
			outputs: [
				{
					internalType: 'uint256',
					name: '',
					type: 'uint256'
				}
			],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [],
			name: '_nextTokenId',
			outputs: [
				{
					internalType: 'uint256',
					name: '',
					type: 'uint256'
				}
			],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [
				{
					internalType: 'address',
					name: 'owner',
					type: 'address'
				}
			],
			name: 'balanceOf',
			outputs: [
				{
					internalType: 'uint256',
					name: '',
					type: 'uint256'
				}
			],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [
				{
					internalType: 'uint256',
					name: '',
					type: 'uint256'
				}
			],
			name: 'docId2AvailDocMetadata',
			outputs: [
				{
					internalType: 'bytes32',
					name: 'blockHash',
					type: 'bytes32'
				},
				{
					internalType: 'bytes32',
					name: 'txHash',
					type: 'bytes32'
				},
				{
					internalType: 'string',
					name: 'name',
					type: 'string'
				}
			],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [
				{
					internalType: 'uint256',
					name: '',
					type: 'uint256'
				}
			],
			name: 'docId2ParentTokenId',
			outputs: [
				{
					internalType: 'uint256',
					name: '',
					type: 'uint256'
				}
			],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [
				{
					internalType: 'uint256',
					name: 'tokenId',
					type: 'uint256'
				}
			],
			name: 'getApproved',
			outputs: [
				{
					internalType: 'address',
					name: '',
					type: 'address'
				}
			],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [
				{
					internalType: 'uint256',
					name: 'tokenId',
					type: 'uint256'
				}
			],
			name: 'getDocIdbyTokenId',
			outputs: [
				{
					internalType: 'uint256',
					name: '',
					type: 'uint256'
				}
			],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [
				{
					internalType: 'uint256',
					name: 'tokenId',
					type: 'uint256'
				}
			],
			name: 'getTokenInfo',
			outputs: [
				{
					components: [
						{
							internalType: 'uint256',
							name: 'docId',
							type: 'uint256'
						},
						{
							internalType: 'bool',
							name: 'isParent',
							type: 'bool'
						},
						{
							internalType: 'uint256',
							name: 'parentTokenId',
							type: 'uint256'
						},
						{
							internalType: 'uint256[]',
							name: 'readbleTokenIds',
							type: 'uint256[]'
						}
					],
					internalType: 'struct RWAAV1.TokenInfo',
					name: '',
					type: 'tuple'
				}
			],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [
				{
					internalType: 'address',
					name: 'owner',
					type: 'address'
				},
				{
					internalType: 'address',
					name: 'operator',
					type: 'address'
				}
			],
			name: 'isApprovedForAll',
			outputs: [
				{
					internalType: 'bool',
					name: '',
					type: 'bool'
				}
			],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [],
			name: 'name',
			outputs: [
				{
					internalType: 'string',
					name: '',
					type: 'string'
				}
			],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [],
			name: 'owner',
			outputs: [
				{
					internalType: 'address',
					name: '',
					type: 'address'
				}
			],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [
				{
					internalType: 'uint256',
					name: 'tokenId',
					type: 'uint256'
				}
			],
			name: 'ownerOf',
			outputs: [
				{
					internalType: 'address',
					name: '',
					type: 'address'
				}
			],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [],
			name: 'scriptURI',
			outputs: [
				{
					internalType: 'string[]',
					name: '',
					type: 'string[]'
				}
			],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [
				{
					internalType: 'bytes4',
					name: 'interfaceId',
					type: 'bytes4'
				}
			],
			name: 'supportsInterface',
			outputs: [
				{
					internalType: 'bool',
					name: '',
					type: 'bool'
				}
			],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [],
			name: 'symbol',
			outputs: [
				{
					internalType: 'string',
					name: '',
					type: 'string'
				}
			],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [
				{
					internalType: 'uint256',
					name: 'index',
					type: 'uint256'
				}
			],
			name: 'tokenByIndex',
			outputs: [
				{
					internalType: 'uint256',
					name: '',
					type: 'uint256'
				}
			],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [
				{
					internalType: 'uint256',
					name: '',
					type: 'uint256'
				}
			],
			name: 'tokenId2TokenInfo',
			outputs: [
				{
					internalType: 'uint256',
					name: 'docId',
					type: 'uint256'
				},
				{
					internalType: 'bool',
					name: 'isParent',
					type: 'bool'
				},
				{
					internalType: 'uint256',
					name: 'parentTokenId',
					type: 'uint256'
				}
			],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [
				{
					internalType: 'address',
					name: 'owner',
					type: 'address'
				},
				{
					internalType: 'uint256',
					name: 'index',
					type: 'uint256'
				}
			],
			name: 'tokenOfOwnerByIndex',
			outputs: [
				{
					internalType: 'uint256',
					name: '',
					type: 'uint256'
				}
			],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [
				{
					internalType: 'uint256',
					name: 'tokenId',
					type: 'uint256'
				}
			],
			name: 'tokenURI',
			outputs: [
				{
					internalType: 'string',
					name: '',
					type: 'string'
				}
			],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [],
			name: 'totalSupply',
			outputs: [
				{
					internalType: 'uint256',
					name: '',
					type: 'uint256'
				}
			],
			stateMutability: 'view',
			type: 'function'
		}
	];

	private rpcProvider: JsonRpcProvider | null = null;
	private walletProvider: BrowserProvider | null = null;

	async createReadalbeDocumentToken(docId: number, toAddress: string) {
		await this.switchChainAndApproveIfRequired();

		const contract = await this.getContract(true);

		const tx = (await contract.getFunction('createReadableToken')(
			docId,
			toAddress
		)) as ContractTransactionResponse;

		console.log('TX submitted: ', tx.hash);

		tokenscript.action.showTransactionToast('submitted', Number(chainID), tx.hash);

		await tx.wait(1);

		tokenscript.action.showTransactionToast('confirmed', Number(chainID), tx.hash);

		console.log('createReadalbeDocumentToken TX Confirmed!!');
	}

	async revokeAndBurnReadalbeDocumentToken(tokenId: number) {
		await this.switchChainAndApproveIfRequired();

		const contract = await this.getContract(true);

		const tx = (await contract.getFunction('revokeReadableToken')(
			tokenId
		)) as ContractTransactionResponse;

		console.log('TX submitted: ', tx.hash);

		tokenscript.action.showTransactionToast('submitted', Number(chainID), tx.hash);

		await tx.wait(1);

		console.log('revokeAndBurnReadalbeDocumentToken TX Confirmed!!');

		tokenscript.action.showTransactionToast('confirmed', Number(chainID), tx.hash);
	}

	async getOwnerOfByTokenId(tokenId: number) {
		await this.switchChainAndApproveIfRequired();

		const contract = await this.getContract(true);

		const res = await contract.getFunction('ownerOf')(tokenId);

		console.log('getOwnerOfByTokenId res: ', res);
		return res;
	}

	async getAvailDocMetadataByDocId(docId: number) {
		await this.switchChainAndApproveIfRequired();

		const contract = await this.getContract(true);

		const res = await contract.getFunction('docId2AvailDocMetadata')(docId);

		console.log('docId2AvailDocMetadata res: ', res);
		return res;
	}

	async createDocumentToken(availBlockHash: string, availTxHash: string, documentName: string) {
		await this.switchChainAndApproveIfRequired();

		const contract = await this.getContract(true);

		const tx = (await contract.getFunction('createDocument')([
			availBlockHash,
			availTxHash,
			documentName
		])) as ContractTransactionResponse;

		console.log('TX submitted: ', tx.hash);
		tokenscript.action.showTransactionToast('submitted', Number(chainID), tx.hash);

		await tx.wait(1);

		console.log('TX Confirmed!!');
		tokenscript.action.showTransactionToast('confirmed', Number(chainID), tx.hash);

		// Use events to find document ID
		const createdEventFilter = contract.getEvent('DocumentCreated')(null);
		console.log('createdEventFilter', createdEventFilter);

		const toBlock = await contract.runner!!.provider!!.getBlockNumber();
		console.log('toBlock', toBlock);

		const events = await contract.queryFilter(createdEventFilter, toBlock - 1000, toBlock);
		console.log('events', events);
		const docIdEvent = events.find((event) => {
			return event.transactionHash === tx.hash;
		}) as EventLog;
		console.log('docIdEvent', docIdEvent);

		if (docIdEvent) {
			const docId = docIdEvent.args[0]; // maybe minus 1
			console.log('Document ID: ', String(docId));
			return docId;
		}

		console.error('Could not find document ID from event.');
	}

	async getContract(writable = false) {
		return new Contract(
			RWAAContract.CONTRACT_ADDR,
			RWAAContract.CONTRACT_ABI,
			writable ? await this.getWalletProvider().getSigner() : this.getRpcProvider()
		);
	}

	getWalletProvider() {
		if (!this.walletProvider) this.walletProvider = new BrowserProvider(window.ethereum, 'any');
		return this.walletProvider;
	}

	getRpcProvider() {
		if (!this.rpcProvider) {
			const network = new Network('sepolia', chainID);
			return new JsonRpcProvider(rpcURL, network, {
				staticNetwork: network
			});
		}
		return this.rpcProvider;
	}

	async switchChainAndApproveIfRequired() {
		const walletProvider = this.getWalletProvider();

		if ((await walletProvider.getNetwork()).chainId.toString() != chainID) {
			console.log('Switching chain...');
			await walletProvider.send('wallet_switchEthereumChain', [
				{ chainId: '0x' + Number(chainID).toString(16) }
			]);
		}
	}
}

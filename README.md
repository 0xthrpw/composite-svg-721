# composite-svg-721

## Composite SVG NFTs

### Infinitely nestable non fungible tokens with fully on chain artwork and metadata.

Composite721 is a token contract that allows tokens to be 'composed' of other tokens that use the same interface.  Tokens have a global layer and a set of user configureable layers that consist of a layer's contract address and token id.

Composite721 tokens can be specified as a 'substrate' or a 'component',  a substrate can be made up of other substrates or components, but components can only return their own svg data.  Substrates can be thought of as nodes on a tree, and components as the leaves at the end.  The terminal composite721 token itself would be the trunk of such a tree.

Using a pattern such as this allows for a system where tokens can act as upgradeable in-game items that reflect their properties on chain in real time and require no back end infrastructure to support.  All data is on chain.

### Substrates
Substrate contracts can be configured to refer to each layer as a different contract and token id, or can refer to another token id on that substrate contract itself.  (Substrate token ids cannot refer directly to themselves or would infinitely recurse.)  

Composite721 tokens can be configured to only allow an item to be used once in another substrate, however that parent substrate maybe included in another parent substrate, and so on.  

Each Composite721 contract has a global layer that can be set so it is present in all of its substrate tokens.  

A user can only add a layer to one of their substrate tokens if they possess the token of the layer they are specifying.  If a user transfers any of these tokens out of the terminal parent substrate then it will immediately disappear from the svg data of that parent substrate token. However if the layer configuration is not updated and the token is transferred back to the user's wallet, then it will once again be reflected in the svg data.

### Components
Composite721 components can not refer to other tokens as layers and can only return their own separately assigned svg data that is set using the setComponent function after calling toggleComponent.

## Contrasts with the current EIP-998 draft.  

First, as opposed to EIP998 standard, the normal ownership pattern is preserved in the Composite721 contract. Users do not have to send tokens to another contract and do not ever lose possession of any of their tokens.  Because of how the layer tracking system of composite721 is implemented, substrate layers of these tokens can be pre-specified and will reflect newly acquired items in the svg data of the substrate metadata as soon as they arrive in a user's wallet.  

Secondly, the spirit of Composite721 pattern is directed towards token interoperability and gaming oriented projects and less as a financial primitive.  The primary benefit of the Composite721 pattern is to facilitate representing on-chain imagery in composeable way. The ERC998 standard supports nesting ERC20 tokens where the Composite721 pattern does not, Only ERC721 tokens can be specified as layers in a Composite721 token.

## Composite721 Interface

function addLayer ( uint256 _id, Layer memory _layer ) public onlyTokenOwner(_id);

function rmLayer ( uint256 _itemId, uint256 _layerId ) public onlyTokenOwner(_itemId);

function tokenURI ( uint256 _id ) external view returns (string memory);

function toggleComponent ( bool _status ) external onlyOwner;

function svgData ( uint256 _id ) external view returns (string memory);

function setComponent ( string memory _svgData ) external onlyOwner;

function setAssignment ( uint256 _id, bool _status ) public onlyTokenOwner(_id);

function updateSubstrate ( address _substrate, bool _status ) public onlyOwner;

function updateGlobalLayer ( uint256 _layerId, Layer memory _layer ) public onlyOwner;



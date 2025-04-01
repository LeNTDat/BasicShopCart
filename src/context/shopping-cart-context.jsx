import { createContext, useContext, useState, useReducer } from 'react';
import { DUMMY_PRODUCTS } from '../dummy-products';

export const CartContext = createContext({
    items: [],
    addItemToCart: () => { },
    onUpdateItemsInCart: () => { }
});

const shoppingCartReducer = (state, action) => {
    console.log(action);
    
    switch (action.type) {
        case 'ADD_ITEM':
            {
                const updatedItems = [...state.items];
                
                const existingCartItemIndex = updatedItems.findIndex(
                    (cartItem) => cartItem.id === action.payload
                );
                const existingCartItem = updatedItems[existingCartItemIndex];

                if (existingCartItem) {
                    const updatedItem = {
                        ...existingCartItem,
                        quantity: existingCartItem.quantity + 1,
                    };
                    updatedItems[existingCartItemIndex] = updatedItem;
                } else {
                    const product = DUMMY_PRODUCTS.find((product) => product.id === action.payload);
                    
                    updatedItems.push({
                        id: product.id,
                        name: product.title,
                        price: product.price,
                        quantity: 1,
                    });
                }

                return {
                    ...state,
                    items: updatedItems,
                };
            }
        case 'UPADTE_ITEM':
            {
                const updatedItems = [...state.items];
                const updatedItemIndex = updatedItems.findIndex(
                    (item) => item.id === action.payload.productId
                );

                const updatedItem = {
                    ...updatedItems[updatedItemIndex],
                };

                updatedItem.quantity += action.payload.amount;

                if (updatedItem.quantity <= 0) {
                    updatedItems.splice(updatedItemIndex, 1);
                } else {
                    updatedItems[updatedItemIndex] = updatedItem;
                }

                return {
                    items: updatedItems,
                };
            }
        default:
            break;
    }

    return state;
}

const CartContextProvider = ({ children }) => {

    const [shoppingCartState, shoppingCartDispatch] = useReducer(shoppingCartReducer, {
        items: [],
    });

    const [shoppingCart, setShoppingCart] = useState({
        items: []
    });

    function handleAddItemToCart(id) {
        shoppingCartDispatch({
            type: 'ADD_ITEM',
            payload: id
        })
    }

    function handleUpdateCartItemQuantity(productId, amount) {
        shoppingCartDispatch({
            type: "UPADTE_ITEM",
            payload: {
                productId: productId,
                amount: amount
            }
        })
    }

    return <CartContext.Provider value={{
        items: shoppingCartState.items,
        addItemToCart: handleAddItemToCart,
        onUpdateItemsInCart: handleUpdateCartItemQuantity
    }}>
        {children}
    </CartContext.Provider>
}

export default CartContextProvider;

export const useFormCart = () => {
    return useContext(CartContext)
}
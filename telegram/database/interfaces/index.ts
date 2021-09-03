export interface AddressAttributes {
    id: string,
    addressLineOne: string,
    addressLineTwo: string,
    mobile: string,
    city: string,
    country: string,
    postalCode: string,
    userID: string,
}

export interface CartAttributes {
    orderID: string,
    productID: string,
    quantity: number,
}

export interface CategoryAttributes {
    id: string,
    name: string,
    image: string,
    shopID: string,
    Products?: ProductAttributes[],
}

export interface ChatAttributes {
    chatID: number,
    userID: string,
    shopID: number,
}

export interface NoteAttributes {
    id: string,
    paymentID: string,
    text: string,
}

export interface OrderAttributes {
    id: string,
    userID: string,
    shopID: string,
    status?: string,
}

export interface PaymentAttributes {
    id: string,
    orderID: string,
    addressID: string,
    deliveryDate: string,
}

export interface ProductAttributes {
    id: string,
    name: string,
    description: string,
    image: string,
    price: number,
    quantity: number,
    categoryID: string,
}

export interface ShopAttributes {
    botID: string,
    name: string,
    image: string | null,
    botToken: string,
    ownerID: string
    Orders?: OrderAttributes[],
    Categories?: CategoryAttributes[]
}

export interface UserAttributes {
    telegramID: string,
    name: string,
    isOwner?: boolean,
}

export interface VoucherAttributes {
    id: string,
    code: string,
    discount: number,
    isValid: boolean,
    shopID: string,
}

export interface VoucherUserAttributes {
    isClaimed: boolean,
    voucherID: string,
    userID: string,
}
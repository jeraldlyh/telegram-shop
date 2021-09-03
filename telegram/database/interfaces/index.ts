export interface ShopAttributes {
    botID: string,
    name: string,
    image: string | null,
    botToken: string,
    ownerID: string
    Orders?: OrderAttributes[],
    Categories?: CategoryAttributes[]
}

export interface OrderAttributes {
    id: string,
    userID: string,
    shopID: string,
    status?: string,
}

export interface CategoryAttributes {
    id: string,
    name: string,
    image: string,
    shopID: string,
    Products?: ProductAttributes[],
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
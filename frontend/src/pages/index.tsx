import React, { useState, Fragment, useEffect } from "react"
import Image from "next/image"
import _ from "lodash"
import NumberFormat from "react-number-format"
import classNames from "classnames"
import Card from "./components/card"
import Button from "./components/button"
import ImageSelector from "./components/form/imageSelector"
import axiosInstance from "../axios/axiosInstance"


type Props = {
    category: object
}

export default function Home() {
    const [images, setImages] = useState<[]>([])
    const [product, setProduct] = useState({
        category: "",
        name: "",
        description: "",
        image: "",
        price: "",
        quantity: "",
    })

    useEffect(() => {
        axiosInstance.get("/api/category/1947480752").then(res => console.log(res))
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        var data = { ...product }
        _.set(data, e.target.name, e.target.value)
        setProduct(data)
    }

    const priceLimit = ({ floatValue }: any) => floatValue <= 999999

    const onChange = (imageList: any, addUpdateIndex: any) => {
        setImages(imageList)
    }

    return (
        <Card>
            <div className="flex flex-col h-full">
                <span className="mb-5 font-bold text-lg">Upload Product</span>
                <div className="flex flex-col w-full h-full space-y-3 md:flex-row md:space-x-3 md:space-y-0">
                    <div className="flex flex-col w-full md:w-1/2 space-y-4 h-full">
                        <div className="flex flex-col md:flex-row md:justify-between h-1/5">
                            <span className="w-1/3">Name</span>
                            <input
                                id="name"
                                name="name"
                                className="w-full md:w-2/3 border rounded text-center text-sm md:text-base focus:ring-1 focus:ring-purple focus:outline-none"
                                type="text"
                                placeholder="Product Name"
                                value={product.name}
                                onChange={e => handleChange(e)}
                            />
                        </div>
                        <div className="flex flex-col md:flex-row md:justify-between h-1/5">
                            <span className="w-1/3">Description</span>
                            <input
                                id="Description"
                                name="description"
                                className="w-full md:w-2/3 border rounded text-center text-sm md:text-base focus:ring-1 focus:ring-purple focus:outline-none"
                                type="text"
                                placeholder="Product Description"
                                value={product.description}
                                onChange={e => handleChange(e)}
                            />
                        </div>
                        <div className="flex flex-col md:flex-row md:justify-between h-1/5">
                            <span className="w-1/3">Price</span>
                            <NumberFormat
                                className="w-full md:w-2/3 border rounded text-center text-sm md:text-base focus:ring-1 focus:ring-purple focus:outline-none"
                                value={product.price}
                                prefix="$"
                                type="text"
                                thousandSeparator={true}
                                displayType="input"
                                onValueChange={(values) => {
                                    const { formattedValue, value } = values
                                    var data = { ...product }
                                    data.price = formattedValue
                                    setProduct(data)
                                }}
                                placeholder="Product Price"
                                isAllowed={priceLimit}
                            />
                        </div>
                        <div className="flex flex-col md:flex-row md:justify-between h-1/5">
                            <span className="w-1/3">Quantity</span>
                            <input
                                id="quantity"
                                name="quantity"
                                className="w-full md:w-2/3 border rounded text-center text-sm md:text-base focus:ring-1 focus:ring-purple focus:outline-none"
                                type="number"
                                placeholder="Product Quantity"
                                value={product.quantity}
                                onChange={e => handleChange(e)}
                            />
                        </div>
                        <div className="flex flex-col md:flex-row md:justify-between">
                            <span className="w-1/3">Image</span>
                            <div className="flex flex-col w-full md:w-2/3 text-sm md:text-base">
                                <ImageSelector images={images} setImages={setImages} onChange={onChange}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col w-full md:w-1/2">
                        <span className="font-semibold">Telegram Message Preview</span>
                    </div>
                </div>
            </div>
        </Card>
    )
}

// export async function getServerSideProps() {
//     try {
//         const response = await axiosInstance.get("/api/category/1947480752")
//         console.log(response)
        
//     } catch (error) {
//         // console.log(error)
//     }
//     return {
//         props: {}
//     }
// }

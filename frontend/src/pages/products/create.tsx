import React, { useState } from "react"
import Image from "next/image"
import _ from "lodash"
import axiosInstance from "../../axios/axiosInstance"
import NumberFormat from "react-number-format"
import { FiMinus, FiPlus } from "react-icons/fi"
import Card from "../components/card"
import ImageSelector from "../components/form/imageSelector"
import ListBox from "../components/form/listBox"


type Props = {
    categoryNames: [{
        id: string,
        name: string
    }]
}

export default function Products({ categoryNames }: Props) {
    const [images, setImages] = useState<any[]>([])
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [quantity, setQuantity] = useState("")
    const [category, setCategory] = useState(categoryNames[0])

    const priceLimit = ({ floatValue }: any) => floatValue <= 999999 && floatValue >= 0 || !floatValue

    const onChange = (imageList: any, addUpdateIndex: any) => {
        setImages(imageList)
        console.log(imageList)
    }

    const handleUpload = async () => {
        try {
            const file = {
                name: `shop-${name}`,
                data: images[0]["data_url"],
                type: images[0]["file"]["type"],
            }

            const response = await axiosInstance.post("api/product", file)
            console.log(response)
        } catch (error) {
            console.log(error)
        }

    }

    return (
        <Card>
            <div className="flex flex-col h-full">
                <div className="flex flex-col w-full h-full space-y-3 md:flex-row md:space-x-3 md:space-y-0">
                    <div className="flex flex-col w-full md:w-1/2 space-y-4 h-full">
                        <span className="mb-5 font-bold text-lg">Upload Product</span>
                        <div className="flex flex-col md:flex-row md:justify-between">
                            <span className="w-1/3">Category</span>
                            <div className="w-full md:w-2/3 text-sm md:text-base">
                                <ListBox data={categoryNames} selected={category} setSelected={setCategory} />
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row md:justify-between">
                            <span className="w-1/3">Name</span>
                            <input
                                id="name"
                                name="name"
                                className="w-full md:w-2/3 py-0.5 border rounded text-center text-sm md:text-base focus:ring-1 focus:ring-purple focus:outline-none"
                                type="text"
                                placeholder="Product Name"
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col md:flex-row md:justify-between">
                            <span className="w-1/3">Description</span>
                            <input
                                id="Description"
                                name="description"
                                className="w-full md:w-2/3 py-0.5 border rounded whitespace-normal text-center text-sm md:text-base focus:ring-1 focus:ring-purple focus:outline-none"
                                type="text"
                                placeholder="Product Description"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col md:flex-row md:justify-between">
                            <span className="w-1/3">Price</span>
                            <NumberFormat
                                className="w-full md:w-2/3 py-0.5 border rounded text-center text-sm md:text-base focus:ring-1 focus:ring-purple focus:outline-none"
                                value={price}
                                prefix="$"
                                type="text"
                                thousandSeparator={true}
                                displayType="input"
                                onValueChange={(values) => {
                                    const { formattedValue, value } = values
                                    setPrice(formattedValue)
                                }}
                                placeholder="Product Price"
                                isAllowed={priceLimit}
                            />
                        </div>
                        <div className="flex flex-col md:flex-row md:justify-between">
                            <span className="w-1/3">Quantity</span>
                            <input
                                id="quantity"
                                name="quantity"
                                className="w-full md:w-2/3 py-0.5 border rounded text-center text-sm md:text-base focus:ring-1 focus:ring-purple focus:outline-none"
                                type="number"
                                placeholder="Product Quantity"
                                value={quantity}
                                onChange={e => setQuantity(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col md:flex-row md:justify-between">
                            <span className="w-1/3">Image</span>
                            <div className="flex flex-col w-full md:w-2/3 text-sm md:text-base">
                                <ImageSelector images={images} setImages={setImages} onChange={onChange} />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col w-full md:w-1/2">
                        <span className="mb-5 font-bold text-lg">Telegram Message Preview</span>
                        <div className="flex flex-col p-8 rounded-lg bg-gray-800 bg-opacity-40 h-full ">
                            {
                                images && images.length !== 0
                                    ? <Image src={images[0]["data_url"]} alt="" width={250} height={150} layout="fixed" />
                                    : <Image src="/download.png" alt="" width={250} height={150} layout="fixed" />
                            }
                            <span className="underline font-semibold">{name ? name : "This is your product name"}</span>
                            <br />
                            <span className="line-clamp-8 whitespace-normal italic break-words text-sm">{description ? description : "This is a description of your product"}</span>
                            <br />
                            <span>
                                Price: <NumberFormat
                                    value={price ? price : "0"}
                                    prefix="$"
                                    type="text"
                                    displayType="text"
                                    thousandSeparator={true}
                                />
                            </span>
                            <span>Available Quantity: {quantity ? quantity : 0}</span>
                            <div className="flex flex-col space-y-2">
                                <div className="flex space-x-2">
                                    <span className="flex py-2 rounded-lg items-center justify-center bg-gray-800 bg-opacity-25 w-1/2"><FiMinus />Remove</span>
                                    <span className="flex py-2 rounded-lg items-center justify-center  bg-gray-800 bg-opacity-25 w-1/2"><FiPlus />Add</span>
                                </div>
                                <span className="text-center py-2 rounded-lg items-center justify-center bg-gray-800 bg-opacity-25">Quantity: 0</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={handleUpload}>test</button>
                </div>
            </div>
        </Card>
    )
}

export async function getServerSideProps() {
    const response = await axiosInstance.get("/api/category/1947480752")
    const categoryNames = _.map(response.data, (category) => {
        return ({
            id: category.id,
            name: category.name
        })
    })

    if (categoryNames) {
        return {
            props: {
                categoryNames: categoryNames
            }
        }
    }
    return {
        props: {}
    }
}

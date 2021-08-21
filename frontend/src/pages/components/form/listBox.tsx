import { Listbox, Transition } from "@headlessui/react"
import classNames from "classnames"
import { AiOutlineCheck } from "react-icons/ai"
import { RiArrowUpDownFill } from "react-icons/ri"


type Props = {
    data: [{
        id: string,
        name: string,
    }]
    selected: {
        id: string,
        name: string,
    },
    setSelected: (React.Dispatch<React.SetStateAction<{
        id: string,
        name: string,
    }>>),
}

function ListBox({ data, selected, setSelected }: Props) {
    const style = (active: boolean) => classNames({
        "bg-blue-500 text-white": active,
        "bg-white text-black": !active
    })

    const listBoxOption = (active: boolean) => {
        console.log(active)
        return classNames({
        
        "cursor-default select-none relative": true,
        "text-yellow-900 bg-yellow-100": active,
        "text-gray-900": !active,
    })}

    const selectedOption = (selected: boolean) => classNames({
        "flex items-center justify-between px-2 truncate": true,
        "font-medium": selected,
        "font-normal": !selected,
    })

    return (
        <Listbox value={selected} onChange={setSelected}>
            <div className="relative">
                <Listbox.Button className="flex justify-between items-center w-full border px-2 py-1 text-left rounded cursor-default focus:outline-none focus-visible:ring-1 focus-visible:ring-purple">
                    <span className="block truncate">{selected.name}</span>
                    <span className="pointer-events-none"><RiArrowUpDownFill /></span>
                </Listbox.Button>
                <Transition
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                >
                    <Listbox.Options className="absolute w-full mt-1 py-1 overflow-auto bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {
                            data.map(o => (
                                <Listbox.Option key={o.id} className={({ active }) => listBoxOption(active)} value={o}>
                                    {({ active, selected }) => (
                                        <div className={selectedOption(selected)}>
                                            {o.name}
                                            {
                                                selected
                                                    ? <AiOutlineCheck />
                                                    : null
                                            }
                                        </div>
                                    )}
                                </Listbox.Option>
                            ))
                        }
                    </Listbox.Options>
                </Transition>
            </div>
        </Listbox>
    )
}

export default ListBox
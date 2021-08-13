import { Fragment, useState } from "react"
import { Listbox, Transition } from "@headlessui/react"


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
    return (
        <Listbox value={selected} onChange={setSelected}>
            {({ open }) => {
                <Fragment>
                    <Listbox.Button>{selected.name}</Listbox.Button>
                    <Transition
                        show={open}
                        enter="transition duration-100 ease-out"
                        enterFrom="transform scale-95 opacity-0"
                        enterTo="transform scale-100 opacity-100"
                        leave="transition duration-75 ease-out"
                        leaveFrom="transform scale-100 opacity-100"
                        leaveTo="transform scale-95 opacity-0"
                    >
                        <Listbox.Options static>
                            {
                                data.map(o => (
                                    <Listbox.Option key={o.id} value={o}>
                                        {o.name}
                                    </Listbox.Option>
                                ))
                            }
                        </Listbox.Options>
                    </Transition>
                </Fragment>
            }}
        </Listbox>
    )
}

export default ListBox
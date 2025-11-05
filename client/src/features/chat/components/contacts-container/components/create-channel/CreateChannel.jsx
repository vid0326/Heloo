import React, { useRef, useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { useDispatch } from 'react-redux'
import { setContactsEmpty } from '../../../../chatSlice'
import InlineUserSelector from './components/MultipleSelect'

const CreateChannel = () => {
    const [openNewContactModal, setOpenNewContactModal] = useState(false);
    const dispatch = useDispatch();
    const componentRef = useRef();
    const [channelName, setChannelName] = useState('');

    const handleNewContact = () => {
        setOpenNewContactModal(false);
        dispatch(setContactsEmpty());
    };

    return (
        <>
            <Tooltip>
                <TooltipTrigger>
                    <FaPlus
                        className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
                        onClick={() => {
                            setOpenNewContactModal(true);
                        }}
                    />
                </TooltipTrigger>
                <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
                    Create New Channel
                </TooltipContent>
            </Tooltip>

            <Dialog open={openNewContactModal} onOpenChange={handleNewContact}>
                <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Select contacts to create a channel</DialogTitle>
                        <DialogDescription>select at least one contact</DialogDescription>
                    </DialogHeader>
                    <div className='space-y-3'>
                        <div className='flex gap-3'>
                            <input
                                placeholder="Enter channel name..."
                                className="rounded-lg p-3 bg-[#2c2e3b] border-none w-3/4"
                                value={channelName}
                                maxLength={20}
                                onChange={(e) => setChannelName(e.target.value)}
                                required
                            />
                            <button type='button' onClick={()=>componentRef.current?.handleSubmit()} className='w-1/4 bg-[#8417ff] hover:bg-[#741bda] cursor-pointer hover: rounded-xl'>Create</button>
                        </div>
                        <InlineUserSelector channelName={channelName} setOpenNewContactModal={setOpenNewContactModal} ref={componentRef} />
                    </div>

                </DialogContent>
            </Dialog>
        </>
    )
}

export default CreateChannel;

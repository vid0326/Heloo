import React, { useState, useEffect } from 'react'
import { FaPlus } from 'react-icons/fa'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { useDispatch, useSelector } from 'react-redux'
import { colors, useDebounce } from '../../../../../../lib/utils'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { searchContactsAsync, selectContacts, setContactsEmpty, setCurrentChat, setChatType, selectIsSearchingContacts } from '../../../../chatSlice'

const NewDm = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearchQuery = useDebounce(searchQuery);
    const [openNewContactModal, setOpenNewContactModal] = useState(false);
    const dispatch = useDispatch();
    const contacts = useSelector(selectContacts);
    const isSearchingContacts = useSelector(selectIsSearchingContacts);


    const handleNewContact = () => {
        setOpenNewContactModal(false);
        setSearchQuery('');
        dispatch(setContactsEmpty());
    };

    const handleSelectContact = (contact) => {
        dispatch(setChatType('contact'));
        setOpenNewContactModal(false);
        setSearchQuery('');
        dispatch(setContactsEmpty());
        dispatch(setCurrentChat(contact));
    }

    const handleInputChange = (e) => {
        if (searchQuery === '' && e.target.value.trim() === '') return;
        dispatch(setContactsEmpty());
        setSearchQuery(e.target.value);
    };

    useEffect(() => {
        if (debouncedSearchQuery) {
            dispatch(searchContactsAsync({ searchTerm: debouncedSearchQuery }));
        }
    }, [debouncedSearchQuery, dispatch]);

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
                    Select New Contact
                </TooltipContent>
            </Tooltip>
            <Dialog open={openNewContactModal} onOpenChange={handleNewContact}>
                <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Please select a contact</DialogTitle>
                        <DialogDescription>howdy</DialogDescription>
                    </DialogHeader>
                    <div className='relative'>
                        <input
                            placeholder="Search Contacts"
                            className="rounded-lg p-3 bg-[#2c2e3b] border-none w-full"
                            value={searchQuery}
                            onChange={handleInputChange}
                        />
                        {isSearchingContacts && (
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </div>
                        )}
                    </div>
                    <ScrollArea className="mt-3 h-[200px]">
                        <div className='flex flex-col justify-center'>
                            {contacts.length > 0 && contacts.map((contact) => (
                                <div className='flex border-b gap-3 items-center justify-start cursor-pointer rounded-lg hover:bg-[#2d2d4d] p-2 transition-all' key={contact._id} onClick={() => handleSelectContact(contact)}>
                                    <Avatar className="h-10 w-10 rounded-full">
                                        {contact.profileImage ? <AvatarImage className="object-cover w-full h-full bg-black" src={`${import.meta.env.VITE_HOST}/${contact.profileImage}`} alt="profile" />
                                            :
                                            <div className={`uppercase h-10 w-10 text-lg border-[1px] flex items-center justify-center ${colors[contact.color]} rounded-full`}>
                                                {contact.fullName.split('')[0]}
                                            </div>
                                        }
                                    </Avatar>
                                    <div className='flex flex-col'>
                                        <span className="font-semibold text-white">{contact.fullName}</span>
                                        <span className='text-xs text-[#bdbdbd]'>@{contact.username}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default NewDm;

import axios from 'axios';
import { setFileDownloadProgress, setFileUploadProgress } from './chatSlice';

export function searchContacts(searchQuery) {
    // console.log("searchContacts", searchQuery);
    return new Promise(async (resolve) => {

        const response = await fetch(`${import.meta.env.VITE_HOST}/contacts/search`,
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(searchQuery)
            }
        )
        const data = await response.json();

        resolve({ data });
    })
}

export function getMessages(senderId, receiverId) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_HOST}/messages?senderId=${senderId}&receiverId=${receiverId}`, {
                method: 'GET',
                credentials: 'include',
            })
            if (!response.ok) {
                const err = await response.json();
                throw err;
            }
            const data = await response.json();
            resolve({ data });
        } catch (error) {
            reject(error);
        }
    })
}

export function getDmContactList() {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_HOST}/contacts/getdmcontacts`, {
                method: 'GET',
                credentials: 'include',
            })
            if (!response.ok) {
                const err = await response.json();
                throw err;
            }
            const data = await response.json();
            resolve({ data });
        } catch (error) {
            reject(error);
        }
    })
}

export function uploadFile(formData, dispatch) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_HOST}/messages/uploadFile`, formData,
                {
                    withCredentials: true,
                    onUploadProgress: (progressEvent) => {
                        const { loaded, total } = progressEvent;
                        const percentCompleted = Math.round((loaded * 100) / total);
                        dispatch(setFileUploadProgress(percentCompleted));
                    }
                }
            );
            resolve({ data: response.data });
        } catch (error) {
            reject(error);
        }
    });
}

export function downloadFile(filePath, dispatch) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_HOST}/${filePath}`, {
                responseType: 'blob',
                withCredentials: true,
                onDownloadProgress: (progressEvent) => {
                    const { loaded, total } = progressEvent;
                    if (total) {
                        const percentCompleted = Math.round((loaded * 100) / total);
                        dispatch(setFileDownloadProgress(percentCompleted));
                    }
                }
            });

            const blob = response.data;
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filePath.split('/').pop(); // Get the filename
            document.body.appendChild(link);
            link.click();

            // Cleanup
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            resolve({ data: { message: "success" } });
        } catch (error) {
            console.error('File download failed:', error);
            reject(error);
        }
    });
}


export function createChannel(name, members) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_HOST}/channels/create`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({ name, members })
            });
            if (!response.ok) {
                const err = await response.json();
                throw err;
            }
            const data = await response.json();
            resolve({ data });
        } catch (error) {
            reject(error);
        }
    });
}

export const getChannels = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_HOST}/channels`, {
                method: 'GET',
                credentials: 'include',
            });
            if (!response.ok) {
                const err = await response.json();
                throw err;
            }
            const data = await response.json();
            resolve({ data });
        } catch (error) {
            reject(error);
        }
    });
}

export const getChannelMessages = (channelId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_HOST}/channels/messages/${channelId}`, {
                method: "GET",
                credentials: 'include',
            })
            if (!response.ok) {
                const err = await response.json();
                throw err;
            }
            const data = await response.json();
            resolve({ data });
        } catch (error) {
            reject(error);
        }
    })
}

export const getChannelMembers = (channelId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_HOST}/channels/members/${channelId}`, {
                method: "GET",
                credentials: 'include',
            })
            if (!response.ok) {
                const err = await response.json();
                throw err;
            }
            const data = await response.json();
            resolve({ data });
        } catch (error) {
            reject(error);
        }
    })
}

export const removeMember = (channelId, memberId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_HOST}/channels/remove-member`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({ channelId, memberId })
            })
            if (!response.ok) {
                const err = await response.json();
                throw err;
            }
            const data = await response.json();
            resolve({ data });
        } catch (error) {
            reject(error);
        }
    })
}

export const leaveChannel = (channelId, memberId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_HOST}/channels/leave-channel`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({ channelId, memberId })
            })
            if (!response.ok) {
                const err = await response.json();
                throw err;
            }
            const data = await response.json();
            resolve({ data });
        } catch (error) {
            reject(error);
        }
    })
}

export const addMembers = (channelId, members) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_HOST}/channels/add-members`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({ channelId, members })
            })
            if (!response.ok) {
                const err = await response.json();
                throw err;
            }
            const data = await response.json();
            resolve({ data });
        } catch (error) {
            reject(error);
        }
    })
}

// export const deleteDirectMessage = (messageId) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const response = await fetch(`${import.meta.env.VITE_HOST}/messages/${messageId}`, {
//                 method: 'DELETE',
//                 credentials: 'include',
//             })
//             if (!response.ok) {
//                 const err = await response.json();
//                 throw err;
//             }
//             const data = await response.json();
//             resolve({ data });
//         } catch (error) {
//             reject(error);
//         }
//     })
// }

// export const deleteChannelMessage = (channelMessageId) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const response = await fetch(`${import.meta.env.VITE_HOST}/channels/message/delete/${channelMessageId}`, {
//                 method: 'DELETE',
//                 credentials: 'include',
//             })
//             if (!response.ok) {
//                 const err = await response.json();
//                 throw err;
//             }
//             const data = await response.json();
//             resolve({ data });
//         } catch (error) {
//             reject(error);
//         }
//     })
// }

// export const deleteChannelMessageByAdmin = (channelMessageId)=>{
//     return new Promise(async (resolve, reject) => {
//         try {
//             const response = await fetch(`${import.meta.env.VITE_HOST}/channels/admin-delete-message/${channelMessageId}`, {
//                 method: 'DELETE',
//                 credentials: 'include',
//             })
//             if (!response.ok) {
//                 const err = await response.json();
//                 throw err;
//             }
//             const data = await response.json();
//             resolve({ data });
//         } catch (error) {
//             reject(error);
//         }
//     })
// }

export function deleteChannel(channelId) {
    return new Promise(async (resolve) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_HOST}/channels/delete/${channelId}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (!response.ok) {
                const err = await response.json();
                throw err;
            }
            const data = await response.json();
            resolve({ data });
        } catch (error) {
            reject(error);
        }

    })
}


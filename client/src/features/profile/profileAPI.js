// export function updateProfile(update) {
//     return new Promise(async (resolve) => {
//         const response = await fetch(`${import.meta.env.VITE_HOST}/profile`,
//             {
//                 method: 'PATCH',
//                 headers: {
//                     'content-type': 'application/json',
//                 },
//                 credentials: 'include',
//                 body: JSON.stringify(update)
//             }
//         )
//         const data = await response.json();
//         // console.log("udpateProfile", data)
//         resolve({ data })
//     })
// }

// export function updateProfileImage(formData) {
//     return new Promise(async (resolve) => {
//         const response = await fetch(`${import.meta.env.VITE_HOST}/profile/image`,
//             {
//                 method: 'POST',
//                 credentials: 'include',
//                 body: formData
//             }
//         )
//         const data = await response.json();
//         // console.log("updateProfileImage", data)
//         resolve({ data })
//     })
// }

// export function deleteProfileImage() {
//     return new Promise(async (resolve) => {
//         const response = await fetch(`${import.meta.env.VITE_HOST}/profile/image`,
//             {
//                 method: 'DELETE',
//                 credentials: 'include',
//             }
//         )
//         const data = await response.json();
//         // console.log("deleteProfileImage", data)
//         resolve({ data })
//     })
// }

export function updateChannelProfile(update) {
    return new Promise(async (resolve) => {
        const response = await fetch(`${import.meta.env.VITE_HOST}/channels/channel-profile/${update.channelId}`,
            {
                method: 'PATCH',
                headers: {
                    'content-type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(update)
            }
        )
        const data = await response.json();
        // console.log("updateChannelProfile", data)
        resolve({ data })
    })
}

export function updateChannelProfileImage(formData, channelId) {
    return new Promise(async (resolve) => {
        const response = await fetch(`${import.meta.env.VITE_HOST}/channels/channel-image/${channelId}`,
            {
                method: 'POST',
                credentials: 'include',
                body: formData
            }
        )
        const data = await response.json();
        // console.log("updateChannelProfileImage", data)
        resolve({ data })
    })
}

export function deleteChannelProfileImage(channelId) {
    return new Promise(async (resolve) => {
        const response = await fetch(`${import.meta.env.VITE_HOST}/channels/channel-image/${channelId}`,
            {
                method: 'DELETE',
                credentials: 'include',
            }
        )
        const data = await response.json();
        // console.log("deleteChannelProfileImage", data)
        resolve({ data })
    })
}
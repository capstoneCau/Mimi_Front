import { SERVER_DOMAIN } from '../common/common'

export const sendNotification = async (users, title, body, token) => {
    const res = await fetch(SERVER_DOMAIN + 'notification/', {
        method: "POST",
        mode: 'cors',
        headers: {
            'Authorization' : `Token ${token}`,
            'Content-Type': 'application/json',
        },
        body : JSON.stringify({
        "users" : users,
        "title" : title,
        "body" : body
        }),
    })

    const json = await json();
}
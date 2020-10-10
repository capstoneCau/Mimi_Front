const SERVER_DOMAIN = "http://111.118.40.200:8000/api/v1/user/"

export const getInformation = async (param) => {
    const res = await fetch(SERVER_DOMAIN + param + '/')
    const list = await res.json()

    return list
}
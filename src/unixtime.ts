import { Clipboard, Action, RequestOptions, EnconvoResponse, ResponseAction } from "@enconvo/api";


export default async function main(req: Request): Promise<EnconvoResponse> {
    // let table;
    const options: RequestOptions = await req.json()
    const { input_text, context, selection_text } = options

    let content = input_text || context || selection_text || await Clipboard.selectedText()

    if (!content || !content.trim()) {
        const now = new Date()
        const year = now.getFullYear()
        const month = (now.getMonth() + 1).toString().padStart(2, '0')
        const day = now.getDate().toString().padStart(2, '0')
        const hours = now.getHours().toString().padStart(2, '0')
        const minutes = now.getMinutes().toString().padStart(2, '0')
        const seconds = now.getSeconds().toString().padStart(2, '0')
        content = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    }

    // convert between unix time and human readable time
    // if is unix time, convert to human readable time
    // if is human readable time, convert to unix time
    const isUnixTime = /^[0-9]{10,}(?:\.[0-9]+)?(?:l)?$/.test(content)

    let result = ''

    if (isUnixTime) {
        //  convert to  format YYYY-MM-DD HH:mm:ss

        result = formatUnixTimestamp(content)

    } else {
        const date = new Date(content)
        result = Math.floor(date.getTime() / 1000).toString()
    }

    const actions: ResponseAction[] = [
        Action.Paste({ content: result, closeMainWindow: true }),
        Action.Copy({ content: result })
    ]


    return {
        type: "text",
        content: result.slice(0, 1000) + (result.length > 1000 ? "\n..." : ""),
        actions: actions
    }
}


// Function to format the date into YYYY-MM-DD HH:mm:ss
function formatUnixTimestamp(unixTimestamp: string) {
    // Create a new Date object from the Unix timestamp
    // Remember that JS expects timestamps in milliseconds, Unix timestamp is usually in seconds

    let timestamp = parseInt(unixTimestamp.slice(0, 10)) * 1000

    const date = new Date(timestamp);

    // Format the year, month, day, hours, minutes and seconds
    // Use .toString().padStart(2, '0') to add leading zeroes to months, days, hours, minutes and seconds if needed
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getUTCMonth() returns 0-11, thus +1 
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    // Combine the parts into one string
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


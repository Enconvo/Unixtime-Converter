import { uuid, Clipboard, Action, ActionProps, res } from "@enconvo/api";


export default async function main(req: Request) {
    // let table;
    const { options } = await req.json()
    const { text, context } = options

    const content = text || context || await Clipboard.selectedText()
    const requestId = uuid()

    if (!content || !content.trim()) {
        throw new Error("No content to convert. Please provide a unix time or a human readable time.")
    }

    await res.context({ id: requestId, role: "human", content: content })

    // convert between unix time and human readable time
    // if is unix time, convert to human readable time
    // if is human readable time, convert to unix time
    const isUnixTime = /^[0-9]{10}$/.test(content)
    let result = ''

    if (isUnixTime) {
        const date = new Date(parseInt(content) * 1000)
        //  use local time zone
        result = date.toLocaleString()

    } else {
        const date = new Date(content)
        result = Math.floor(date.getTime() / 1000).toString()
    }

    const actions: ActionProps[] = [
        Action.Paste(result, true),
        Action.Copy(result)
    ]

    const output = {
        content: result.slice(0, 1000) + (result.length > 1000 ? "\n..." : ""),
        actions: actions
    }

    return output;
}



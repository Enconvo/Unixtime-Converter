import { uuid, Clipboard, Action, ActionProps, res } from "@enconvo/api";


export default async function main(req: Request) {
    // let table;
    try {
        const { options } = await req.json()
        const { text, context } = options

        const content = text || context || await Clipboard.selectedText()
        const requestId = uuid()

        // 如果translateText中有换行符，需要添加> 符号
        if (content) {
            await res.context({ id: requestId, role: "human", content: content })
        }

        // convert between unix time and human readable time
        // if is unix time, convert to human readable time
        // if is human readable time, convert to unix time
        const isUnixTime = /^[0-9]{10}$/.test(content)
        let result = ''

        if (isUnixTime) {
            const date = new Date(parseInt(content) * 1000)
            result = date.toString()
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
    } catch (err) {
        console.log(err)
    }
}



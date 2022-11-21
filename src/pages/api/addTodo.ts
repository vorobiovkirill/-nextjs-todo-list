import { uuid } from 'uuidv4';
import { prisma } from "../../server/db/client";
import { type NextApiRequest, type NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const data = req.body;
    console.log('data', data)
    const todo = {
        id: uuid(),
        completed: false,
        order: ++data.order,
        ...data,
    }
    console.log('todo', todo)
    try {
        // @ts-ignore
        const result = await prisma.todos.create({
            data: {
                ...todo,
            },
        });
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(403).json({ err: "Error occured while adding a new todo." });
    }
};
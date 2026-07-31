type LabItem = {
    slug: string,
    title: string,
    description: string
}

export const labItems: LabItem[] = [
    {
        slug: "feedback",
        title: "Feedback",
        description: "A compact feedback flow with clear interaction states.",
    },
    {
        slug: "toast-stack",
        title: "Toast stack",
        description: "Stacked notifications that communicate temporary feedback.",
    },
]
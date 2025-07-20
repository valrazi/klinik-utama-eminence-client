import { EmptyState, List, VStack } from "@chakra-ui/react"
import { HiColorSwatch } from "react-icons/hi"

export default function Empty() {
    return (
        <EmptyState.Root>
            <EmptyState.Content>
                <EmptyState.Indicator>
                    <HiColorSwatch />
                </EmptyState.Indicator>
                <VStack textAlign="center">
                    <EmptyState.Title>No results found</EmptyState.Title>
                    <EmptyState.Description>
                        Data Empty
                    </EmptyState.Description>
                </VStack>
            </EmptyState.Content>
        </EmptyState.Root>
    )
}
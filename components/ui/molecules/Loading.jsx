import { Flex, Spinner } from "@chakra-ui/react";

export default function Loading() {
    return (
        <Flex direction={'column'} width={'full'} height={'full'} justify={'center'} align={'center'}>
            <Spinner />
        </Flex>
    )
}
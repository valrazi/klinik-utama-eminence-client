import { Button } from "@chakra-ui/react";

export default function NavigationButton({
    onClick,
    label = 'Add Data',
    ...rest
}) {
    return (
        <Button
            onClick={onClick}
            backgroundColor={'black'}
            color={'white'}
            fontSize={'14px'}
            border={'1px solid'}
            borderColor={'black'}
            p={'2'}
            rounded={'lg'}
            {...rest}>
            {label}
        </Button>
    )
}
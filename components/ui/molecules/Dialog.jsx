"use client"

import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react"


const DialogSubmit = ({open, setOpen, triggerElement, titleText, bodyElement, onSubmit}) => {
  return (
    <Dialog.Root lazyMount open={open} onOpenChange={(e) => setOpen(e.open)}>
      <Dialog.Trigger asChild>
        {
            triggerElement
        }
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>
                {
                    titleText ?? 'Popup'
                }
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
                {
                    bodyElement
                }
            </Dialog.Body>
            <Dialog.Footer>
              <Button  backgroundColor={'black'} color={'white'} _hover={{ color: 'red' }} size={'lg'} width={'full'} rounded={'xl'} onClick={onSubmit}>Submit</Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
export default DialogSubmit
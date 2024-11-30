import { createContext, useContext, useEffect, useState } from "react"
import { Box, Portal, Show, Stack, Text } from "@chakra-ui/react"
import { Button } from "src/components/primitives/button"
import { Loading } from "src/components/custom/loading"
import { useSaveData } from "src/queries"
import { useSaveMutation } from "src/mutations"
import { LuArrowLeft } from "react-icons/lu"
import { SaveIdContext } from "src/app"
import GeneralEdits from "src/components/save-editing/general-edits"
import StatsEdits from "src/components/save-editing/stats-edits"
import CalendarEdits from "src/components/save-editing/calendar-edits"
import Inventory from "src/components/save-editing/inventory-edits"

const BROWSER_BACK_BTN = 3

export default function Init() {
  const { goToSelection, editingSaveId } = useContext(SaveIdContext)
  const { data, isError } = useSaveData(editingSaveId)

  // Some keyboard shortcuts for easier navigation
  useEffect(() => {
    const handleMouseUp = (e) => {
      const btnCode = e.button
      if (btnCode === BROWSER_BACK_BTN) {
        goToSelection()
      }
    }

    window.addEventListener("mouseup", handleMouseUp)

    return () => {
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [])

  if (isError) {
    return <Text>Error loading the save data</Text>
  }

  if (!data) {
    return <Loading text="Loading save data..." />
  }

  return (
    <Box px={6} py={4} w="full">
      <Box pos="relative">
        <Button variant="subtle" onClick={goToSelection}>
          <LuArrowLeft /> Back
        </Button>
        <SaveEditor saveData={data} saveId={editingSaveId} />
      </Box>
    </Box>
  )
}

export const EditorContext = createContext(null)

function SaveEditor({ saveData, saveId }) {
  // NOTE: We're assuming `edits` will be the same shape as `saveData`
  const [edits, setEdits] = useState(saveData)
  const { mutate, isPending, isError, error } = useSaveMutation(saveId)

  const handleDiscard = () => setEdits((prev) => ({ ...prev, ...saveData }))
  const handleApply = () => mutate(edits)

  const value = {
    edits,
    setEdits
  }

  return (
    <EditorContext.Provider value={value}>
      <Button
        variant="subtle"
        pos="absolute"
        right="20"
        onClick={handleDiscard}
        disabled={isPending}
      >
        Discard
      </Button>
      <Button pos="absolute" right="0" onClick={handleApply} disabled={isPending}>
        Apply
      </Button>
      <Text textStyle="sm" pos="absolute" right="0" opacity="0.8" my="2">
        {saveId}
      </Text>
      <Show when={isPending}>
        <Portal>
          <Box
            pos="fixed"
            top="0"
            left="0"
            w="100vw"
            h="100vh"
            bg="rgba(0, 0, 0, 0.5)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            zIndex="overlay"
          >
            <Loading text="Updating your save..." />
          </Box>
        </Portal>
      </Show>
      <Show when={isError}>{isError && <Text>Error updating save: {error}</Text>}</Show>
      <Box my="10">
        <Stack gap="8">
          <GeneralEdits />
          <CalendarEdits />
          <StatsEdits />
          <Inventory />
        </Stack>
      </Box>
    </EditorContext.Provider>
  )
}

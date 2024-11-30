import { useCallback, useContext } from "react"
import { EditorContext } from "src/components/save-editing"
import {
  Box,
  HStack,
  SimpleGrid,
  Stack,
  Text
} from "@chakra-ui/react"
import { EditIcon } from "src/components/custom/icons"
import { InventoryItem } from "src/components/custom/inventory-input"

export default function InventoryEdits() {
  const { edits, setEdits } = useContext(EditorContext)

  const setInventoryItem = useCallback((id, item) => {
    const newEdits = { ...edits }
    newEdits.inventory[id] = item
    setEdits(newEdits)
  }, [])

  const setRewardInventoryItem = useCallback((id, item) => {
    const newEdits = { ...edits }
    newEdits.reward_inventory[id] = item
    setEdits(newEdits)
  }, [])

  return (
    <Stack gap="4">
      <HStack gap="2">
        <EditIcon />
        <Text textStyle="xl" fontWeight="bold">
          Inventory
        </Text>
      </HStack>
      <SimpleGrid columns={5} gap="8" w="full">
        {edits.inventory.map((item, id) => (
          <Box key={id}>
            <InventoryItem id={id} item={item} setItem={setInventoryItem} />
          </Box>
        ))}
      </SimpleGrid>
      <HStack gap="2">
        <EditIcon />
        <Text textStyle="xl" fontWeight="bold">
          Reward Inventory
        </Text>
      </HStack>
      <SimpleGrid columns={4} gap="8" w="full">
        {edits.reward_inventory.map((item, id) => (
          <Box key={id}>
            <InventoryItem id={id} item={item} setItem={setRewardInventoryItem} />
          </Box>
        ))}
      </SimpleGrid>
    </Stack>
  )
}

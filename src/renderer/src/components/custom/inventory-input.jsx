import { memo } from "react"
import {
  Stack,
  Text,
  CardRoot,
  CardBody,
  CardHeader
} from "@chakra-ui/react"
import { NumberInput } from "src/components/custom/number-input"
import { TextInput } from "src/components/custom/text-input"

export const InventoryItem = memo(function InventoryItem({ id, item, setItem }) {
  const { members, required_tags } = item

  // members: [{item_id, infusion, auto_use, cosmetic, inner_item, gold_to_gain, animal_cosmetic}, {...}]

  let itemId = null
  let quantity = null
  let infusion = null
  let isAnimalCosmetic = null
  let isPlayerCosmetic = null
  let goldToGain = null
  let innerItem = null
  let autoUse = false

  if (members.length > 0) {
    itemId = members[0].item_id
    quantity = members.length
    infusion = members[0].infusion
    isAnimalCosmetic = members[0].animal_cosmetic
    isPlayerCosmetic = members[0].cosmetic
    goldToGain = members[0].gold_to_gain
    innerItem = members[0].inner_item
    autoUse = members[0].auto_use
  }

  const handleItemIdChange = (value) => {
    const newMembers = [{ auto_use: autoUse, cosmetic: isAnimalCosmetic, 
      animal_cosmetic: isAnimalCosmetic, gold_to_gain: goldToGain, 
      item_id: value, inner_item: innerItem, infusion: infusion}]
    setItem(id, { ...item, members: newMembers })
  }

  const handleQuantityChange = (value) => {
    const newMembers = [...members]
    if (value > members.length) {
      for (let i = members.length; i < value; i++) {
        newMembers.push({ ...members[0] })
      }
    } else {
      newMembers.splice(value)
    }
    setItem(id, { ...item, members: newMembers })
  }

  const handleInfusionChange = (value) => {
    const newMembers = [{ ...members[0], infusion: value }]
    setItem(id, { ...item, members: newMembers })
  }

  return (
    <CardRoot bg="gray.950" size="sm">
      <CardHeader>
        <Text w="full">Slot {id + 1}</Text>
      </CardHeader>
      <CardBody>
        <Stack gap="4">
          <TextInput
            textLabel="Item ID"
            autoCorrect="off"
            placeholder="item_id"
            value={itemId || ""}
            onChange={handleItemIdChange}
          />
          <TextInput
            textLabel="Infusion"
            autoCorrect="off"
            placeholder="infusion"
            value={infusion || ""}
            onChange={handleInfusionChange}
          />
          <NumberInput
            label="Quantity"
            placeholder="quantity"
            value={quantity || 0}
            onValueChange={handleQuantityChange}
          />
        </Stack>
      </CardBody>
    </CardRoot>
  )
})

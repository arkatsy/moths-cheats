import {
  Box,
  CheckboxGroup,
  Fieldset,
  Flex,
  HStack,
  SimpleGrid,
  Stack,
  Text,
  VStack
} from "@chakra-ui/react"
import { memo, useContext } from "react"
import { EditorContext } from "src/components/save-editing/"
import { NumberInput } from "src/components/custom/number-input"
import { Checkbox } from "src/components/primitives/checkbox"
import { EditIcon } from "src/components/custom/icons"
import idsJson from "src/ids.json"

const all_scenes = idsJson.scene_history

function formatCutscene(sceneName, reverse = false) {
  const from = reverse ? " " : "_"
  const to = reverse ? "_" : " "

  console.log(sceneName, typeof sceneName)
  return sceneName.replaceAll(from, to)
}

const MiscEdits = memo(function MiscEdits() {
  const { edits, setEdits } = useContext(EditorContext)

  const handleMinesLevelChange = (val) => {
    setEdits((prev) => ({ ...prev, maximumMinesLevel: val }))
  }

  const handleSceneValuesChange = (val) => {
    setEdits((prev) => ({ ...prev, sceneHistory: val }))
  }

  return (
    <Stack gap="4">
      <HStack gap="2">
        <EditIcon />
        <Text textStyle="xl" fontWeight="bold">
          Miscellaneous
        </Text>
      </HStack>

      <Flex justifyContent="space-between">
        <Fieldset.Root as="div" flex="1" w="full">
          <CheckboxGroup
            defaultValue={all_scenes.filter((scene) => edits.sceneHistory.includes(scene))}
            name="cutscenes"
            onValueChange={handleSceneValuesChange}
          >
            <Fieldset.Legend fontSize="sm" mb="2">
              Select cutscenes
            </Fieldset.Legend>
            <Fieldset.Content>
              <SimpleGrid minChildWidth="xs" flex="2" gap="1">
                {all_scenes.map((scene) => (
                  <Checkbox key={scene} value={scene} checked={edits.sceneHistory.includes(scene)}>
                    {formatCutscene(scene)}
                  </Checkbox>
                ))}
              </SimpleGrid>
            </Fieldset.Content>
          </CheckboxGroup>
        </Fieldset.Root>
        <Stack flex="1" maxW="300px" w="full">
          <NumberInput
            label="Maximum Mines Level"
            value={edits.maximumMinesLevel}
            min={1}
            max={100}
            onValueChange={handleMinesLevelChange}
          />
          <Text textStyle="sm" opacity="0.9">
            The max level for the version of the game v0.12.x is 59. Recommending to put that value
            again after done exploring.
          </Text>
        </Stack>
      </Flex>
    </Stack>
  )
})

export default MiscEdits

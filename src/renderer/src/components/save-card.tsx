import { Box, Card, Flex, Text } from '@chakra-ui/react'

import {
  displayCalendarTime,
  displayClockTime,
  displayPlaytime,
  getWeather
} from '@renderer/utils'

export function SaveCard({ saveId }: { saveId: string }) {
  3
  const save = window.api.getLoadingSaveInfo(saveId)

  const data = {
    Gold: Intl.NumberFormat().format(save.stats.gold),
    Essence: Intl.NumberFormat().format(save.stats.essence),
    Renown: Intl.NumberFormat().format(save.stats.renown)
  }

  return (
    <Card.Root
      as="button"
      display="inline"
      bg="gray.900"
      w={{ base: '100%', md: '660px' }}
      maxW="660px"
      mx="auto"
      cursor="pointer"
    >
      <Card.Header display="flex" flexDir="row" justifyContent="space-between" pos="relative">
        <Flex flexDir="column">
          <Text textStyle="xl">
            {save.name} | {displayCalendarTime(save.calendar_time)} -&nbsp;
            {displayClockTime(save.clock_time)} &nbsp;
            <Box as="span">{save.isAutosave && '(autosave)'}</Box>
          </Text>
          <Text textStyle="sm" opacity={0.8}>
            weather: {getWeather(save.calendar_time, save.weather.forecast)}
          </Text>
        </Flex>

        <Box pos="relative">
          <Text textStyle="xl" textAlign="end" ml={2}>
            {save.farm_name}
          </Text>
          <Text pos="absolute" textStyle="xl" opacity={0.9} right="0">
            {displayPlaytime(save.playtime)}
          </Text>
        </Box>
      </Card.Header>
      <Card.Body>
        <Flex flexDir="column" gap={1}>
          {Object.keys(data).map((key, idx) => (
            <Text key={idx}>
              {key}:{' '}
              <Box as="span" opacity="0.9">
                {data[key]}
              </Box>
            </Text>
          ))}
        </Flex>
        <Box pos="absolute" right={6} bottom={7}>
          <Text fontSize="sm" opacity="0.8">
            {save.saveId}
          </Text>
        </Box>
      </Card.Body>
    </Card.Root>
  )
}

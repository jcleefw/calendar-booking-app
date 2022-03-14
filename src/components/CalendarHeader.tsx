import { GridItem, Flex, Grid } from '@chakra-ui/layout';
import { chakra } from '@chakra-ui/system';
import styles from './calendar.module.css';

export const generateCalendarHeader = () => {
  const headers = [];
  for (let count = 0; count < 24; count++) {
    headers.push(
      <GridItem key={`column-header-${count}`} className={styles.headerColumn}>
        <Flex className={styles.headerColumnDesc}>
          <chakra.span className={styles.headerDescHour}>{`${
            count === 0 ? 12 : count > 12 ? count - 12 : count
          }`}</chakra.span>
          <chakra.span className={styles.headerAmPm}>{`${
            count > 11 ? 'pm' : 'am'
          }`}</chakra.span>
        </Flex>
      </GridItem>
    );
  }
  return (
    <GridItem key={'header'} className={styles.headerRow}>
      <Grid
        templateColumns="100px repeat(24, 1fr)"
        templateRows="repeat(1, 1fr)"
        gridColumnGap="1px"
      >
        {[
          <GridItem
            key={`column-header-empty`}
            className={styles.headerColumn}
          >{``}</GridItem>,
          headers,
        ]}
      </Grid>
    </GridItem>
  );
};

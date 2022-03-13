import { GridItem, Flex, Grid } from '@chakra-ui/layout';
import styles from './calendar.module.css';

export const generateCalendarHeader = () => {
  const headers = [];
  for (let count = 0; count < 24; count++) {
    headers.push(
      <GridItem className={styles.headerColumn}>
        <Flex border="1px solid #ccc" justifyContent={'center'} py="10px">
          <span>{`${count > 12 ? count - 12 : count}`}</span>
          {/* <span>{`${count > 11 ? 'pm' : 'am'}`}</span> */}
        </Flex>
      </GridItem>
    );
  }
  return (
    <GridItem className={styles.headerRow}>
      <Grid
        templateColumns="100px repeat(24, 1fr)"
        templateRows="repeat(1, 1fr)"
        gridColumnGap="1px"
      >
        {[<GridItem className={styles.headerColumn}>{``}</GridItem>, headers]}
      </Grid>
    </GridItem>
  );
};

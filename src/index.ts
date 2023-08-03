import { app } from './settings';
import { runDb } from './db/db';


const port = process.env.PORT || 3008

const startingApp = async () => {
  await runDb()
app.listen(port, () => {
  console.log(`Listen ${port}`)
})
}
startingApp()

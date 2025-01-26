import { Routes, Route } from 'react-router-dom'
import RacketList from './RacketList'
import RacketDetails from './RacketDetails'
import ShoeList from './ShoeList'
import ShoeDetails from './ShoeDetails'
import StringingList from './StringingList'
import StringingDetails from './StringingDetails'
import ShuttlecockList from './ShuttlecockList'
import ShuttlecockDetails from './ShuttlecockDetails'
import GripList from './GripList'
import GripDetails from './GripDetails'
import BagList from './BagList'
import BagDetails from './BagDetails'

const ProductRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<div><RacketList /><ShoeList /><StringingList /><ShuttlecockList /><GripList /><BagList /></div>} />
      <Route path="/racket" element={<RacketList />} />
      <Route path="/racket/:id" element={<RacketDetails />} />
      <Route path="/shoes" element={<ShoeList />} />
      <Route path="/shoes/:id" element={<ShoeDetails />} />
      <Route path="/stringings" element={<StringingList />} />
      <Route path="/stringings/:id" element={<StringingDetails />} />
      <Route path="/shuttlecocks" element={<ShuttlecockList />} />
      <Route path="/shuttlecocks/:id" element={<ShuttlecockDetails />} />
      <Route path="/grips" element={<GripList />} />
      <Route path="/grips/:id" element={<GripDetails />} />
      <Route path="/bags" element={<BagList />} />
      <Route path="/bags/:id" element={<BagDetails />} />
    </Routes>
  )
}

export default ProductRoutes 
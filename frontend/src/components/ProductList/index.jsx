import { Routes, Route } from 'react-router-dom'
import RacketList from './Racket/RacketList'
import RacketDetails from './Racket/RacketDetails'
import ShoeList from './Shoe/ShoeList'
import ShoeDetails from './Shoe/ShoeDetails'
import StringingList from './Stringing/StringingList'
import StringingDetails from './Stringing/StringingDetails'
import ShuttlecockList from './Shuttlecock/ShuttlecockList'
import ShuttlecockDetails from './Shuttlecock/ShuttlecockDetails'
import GripList from './Grip/GripList'
import GripDetails from './Grip/GripDetails'
import BagList from './Bag/BagList'
import BagDetails from './Bag/BagDetails'

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
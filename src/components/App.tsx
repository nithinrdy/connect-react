import { BrowserRouter as Router } from "react-router-dom";
import PageTransitionWrapper from "./pageTransitionWrapper";
import OrnamentsComponent from "./ornaments";

function App() {
	return (
		<>
			<OrnamentsComponent />
			{
				// YEsss, put it outside the router and it doesn't reset every frikin re-render!
			}
			<Router>
				<PageTransitionWrapper />
			</Router>
		</>
	);
}

export default App;

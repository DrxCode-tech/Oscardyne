import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Oscardyne from './OscardyneApp';
import PhysicalSecurityDetail from "./PhysicalSecurityDetail";
import CyberSecurityDetail from "./CyberSecurity";
import EventSecurity from './EventSecurity';
import InformationSecurity from './InformationSecurity';
import ResidentialSecurity from './ResidentialSecurity';
import CommercialSecurity from './CommercialSecurity';
import AssessmentPage from './AssessmentPage';
import CareerDashboard from './Pages';

export default function App(){
    return (
        <Router>
            <main className='w-full' >
                <Routes>
                    <Route path='/' element={<Oscardyne />} />
                    <Route path='/physic-security' element={<PhysicalSecurityDetail />} />
                    <Route path='/cyber-security' element={<CyberSecurityDetail />} />
                    <Route path='/event-security' element={<EventSecurity />} />
                    <Route path='/info-security' element={<InformationSecurity />} />
                    <Route path='/residential-security' element={<ResidentialSecurity />} />
                    <Route path='/commercial-security' element={<CommercialSecurity />} />
                    <Route path='/assessment' element={<AssessmentPage />} />
                    <Route path='/jobs' element={<CareerDashboard />} />
                </Routes>
            </main>
        </Router>
    )
}
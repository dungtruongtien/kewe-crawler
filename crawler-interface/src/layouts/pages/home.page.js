import React, { useContext } from 'react'
import { AuthContext } from '../../App';
import { Header } from '../../components/header';
import KWBreadcrumb from '../../components/breadcumb';
import StatisticCard from '../../components/statisticCard';
import KWTable from '../../components/table';
import KWPagination from '../../components/pagination';
import FileUpload from '../../components/fileUpload';
import KWProgressBar from '../../components/progressBar';

export default function HomePage() {
    const { userInfo } = useContext(AuthContext);
    console.log('userInfo----', userInfo);
    return (
        <>
            <Header />
            <KWBreadcrumb />
            <div className='card-wrapper'>
                <div className='card-report'>
                    <StatisticCard />
                </div>
                <div className='card-report'>
                    <StatisticCard />
                </div>
                <div className='card-report'>
                    <StatisticCard />
                </div>
            </div>

            <div className='kw-table-wrapper'>
                <div className='title'>
                    <h4>KWCrawler Info</h4>
                </div>
                <div className='kw-table'>
                    <FileUpload />
                    <KWProgressBar />
                    <KWTable />
                </div>
                    <div className='kw-pagination-wrapper'>
                        <KWPagination />
                    </div>
            </div>
        </>
    )
}

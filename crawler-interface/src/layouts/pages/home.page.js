import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import { format } from 'date-fns';
import { Header } from '../../components/header';
import KWBreadcrumb from '../../components/breadcumb';
import StatisticCard from '../../components/statisticCard';
import KWTable from '../../components/table';
import KWPagination from '../../components/pagination';
import FileUpload from '../../components/fileUpload';
import KWProgressBar from '../../components/progressBar';
import { listKeywords, uploadKeywords } from '../../services/keyword.service';

export default function HomePage() {
    const limitPerPage = 5; //TODO Change this to State and let user choose
    const [keywords, setKeywords] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pageInfo, setPageInfo] = useState({ total: 0, currentPage: 1 });

    const processData = (e) => {
        const file = e.target.files[0];

        if (file) {
            // Validate file type, size.
            console.log('file-----', file);
            if (file.type !== 'text/csv') {
                //TODO throw error and return
                alert('File type must be in CSV format');
                return;
            }

            const fileSizeMaximum = 1000000;
            // validate file size in bytes, 1000000 bytes = 1MB, too large with CSV file with 100 keywords
            if (file.size > 1000000) {
                //TODO throw error and return
                alert(`File type must be less than ${fileSizeMaximum / 1000000}MB`);
                return;
            }

            // Process CSV file
            const reader = new FileReader();

            reader.onload = function (e) {
                const contents = e.target.result;
                if (!contents) {
                    //TODO throw error and return
                    alert('Missing file content');
                }
                console.log('contents----', typeof contents);
                console.log('contents----', contents.split('\n'));
                const rawKeywordArr = contents.split('\n');
                const keywordArr = rawKeywordArr.reduce((total, keyword) => {
                    if (keyword) {
                        const regex = /[^a-zA-Z0-9 ]/g;
                        total.push(keyword.replace(regex, ''));
                    }
                    return total;
                }, []);
                if (keywordArr.length > 0) {
                    //TODO throw error and return
                    alert('List keywords must be less than 100');
                    return;
                }
                console.log('keywordArr----', keywordArr);
                uploadKeywords({ listKeywords: keywordArr }).then((data) => {
                    console.log('data-----', data);
                })
            };
            reader.readAsText(file);
        }
    }

    const handlePopupPreviewHTML = (e) => {
        const popupLink = e.target.value;
        const popupWidth = 1000;
        const popupHeight = 1000;
        const left = (window.innerWidth - popupWidth) / 2;
        const top = (window.innerHeight - popupHeight) / 2;

        // Define the window features, including size and position.
        const features = `width=${1000},height=${1000},left=${left},top=${top},resizable=yes,scrollbars=yes,toolbar=no,location=no`;

        window.open(popupLink, 'windowName', features);
    }

    const handleChangePage = (e) => {
        setIsLoading(true);
        const currentPage = e.target.getAttribute('value');
        const filter = {
            attributes: 'id,totalAdWordsAdvertisers,totalLinks,htmlStaticLink,keyword,createdAt',
            limit: limitPerPage,
            page: currentPage
        }
        let filterStr = Object.keys(filter).reduce((total, key) => {
            total += `&${key}=${filter[key]}`;
            return total;
        }, '');
        filterStr = filterStr.replace('&', '');
        console.log('filterStr-----', filterStr);
        listKeywords(filterStr).then(data => {
            setKeywords(data.rows);
            setPageInfo({ totalPagination: Math.ceil(data.count / limitPerPage), currentPage: parseInt(currentPage) });
            setIsLoading(false);
        });
    }

    const tableColumns = [
        {
            data: 'keyword',
            text: 'keyword',
        },
        {
            data: 'totalAdWordsAdvertisers',
            text: 'Total Ads Links',
        },
        {
            data: 'totalLinks',
            text: 'Total Links',
        },
        {
            data: 'createdAt',
            text: 'Crawled Date',
            render: (value) => {
                return format(new Date(value), 'yyyy-MM-dd hh:mm:ss');
            }
        },
        {
            data: 'htmlStaticLink',
            text: 'HTML preview link',
            render: (value) => {
                return <Button variant="primary" onClick={handlePopupPreviewHTML} value={value}>Preview HTML</Button>
            }
        }
    ]
    useEffect(() => {
        setIsLoading(true);
        listKeywords().then(data => {
            setKeywords(data.rows);
            setPageInfo({ totalPagination: Math.ceil(data.count / limitPerPage), currentPage: 1 });
            setIsLoading(false);
        });
    }, [])

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
                    <FileUpload processData={processData} />
                    <KWProgressBar />
                    <KWTable isLoading={isLoading} columns={tableColumns} data={keywords} />
                </div>
                <div className='kw-pagination-wrapper'>
                    <KWPagination pageInfo={pageInfo} handleChangePage={handleChangePage} />
                </div>
            </div>
        </>
    )
}

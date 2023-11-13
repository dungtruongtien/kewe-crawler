import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import { format } from 'date-fns';
import { Header } from '../../components/header';
import KWBreadcrumb from '../../components/breadcumb';
import KWTable from '../../components/table';
import KWPagination from '../../components/pagination';
import FileUpload from '../../components/fileUpload';
import KWProgressBar from '../../components/progressBar';
import { getKeywordCrawlerProcess, listKeywords, uploadKeywords } from '../../services/keyword.service';
import { useToasts } from 'react-toast-notifications';

export default function HomePage() {
    const limitPerPage = 10; //TODO Change this to State and let user choose
    const { addToast } = useToasts();
    const [keywords, setKeywords] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pageInfo, setPageInfo] = useState({ total: 0, currentPage: 1 });
    const [crawlerProcessInfo, setCrawlerProcessInfo] = useState(null);

    const processData = (e) => {
        const file = e.target.files[0];

        if (file) {
            // Validate file type, size.
            console.log('file-----', file);
            if (file.type !== 'text/csv') {
                addToast('File type must be in CSV format', { appearance: 'error', autoDismiss: true });
                e.target.value = null;
                return;
            }

            const fileSizeMaximum = 1000000;
            // validate file size in bytes, 1000000 bytes = 1MB, too large with CSV file with 100 keywords
            if (file.size > 1000000) {
                addToast(`File type must be less than ${fileSizeMaximum / 1000000}MB`, { appearance: 'error', autoDismiss: true });
                e.target.value = null;
                return;
            }

            // Process CSV file
            const reader = new FileReader();

            reader.onload = function (e) {
                const contents = e.target.result;
                if (!contents) {
                    addToast('Missing file content', { appearance: 'error', autoDismiss: true });
                }
                const rawKeywordArr = contents.split('\n');
                const keywordArr = rawKeywordArr.reduce((total, keyword) => {
                    if (keyword) {
                        const regex = /[^a-zA-Z0-9 ]/g;
                        total.push(keyword.replace(regex, ''));
                    }
                    return total;
                }, []);
                if (keywordArr.length > 100) {
                    addToast('List keywords must be less than 100', { appearance: 'error', autoDismiss: true });
                    return;
                }
                uploadKeywords({ listKeywords: keywordArr }).then(async (data) => {
                    setCrawlerProcessInfo({
                        processPercentage: 0,
                    });
                    const { trackingKey } = data;
                    //Crawler is delay 5s between each key number. Need to upgrade this approach to get better performance.
                    const intervalTime = 5000;
                    const processInterval = setInterval(async () => {
                        const keywordCrawlerProcess = await getKeywordCrawlerProcess({ trackingKey });
                        if (!keywordCrawlerProcess || !keywordCrawlerProcess.listKeywords || keywordCrawlerProcess.listKeywords.length === 0) {
                            setCrawlerProcessInfo(null);
                            addToast('Crawler is done successfully', { appearance: 'success', autoDismiss: true });
                            clearInterval(processInterval);
                            setIsLoading(true);
                            e.target.value = null;
                            const currentPage = 1;
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
                            listKeywords(filterStr).then(data => {
                                setKeywords(data.rows);
                                setPageInfo({ totalPagination: Math.ceil(data.count / limitPerPage), currentPage: parseInt(currentPage) });
                                setIsLoading(false);
                            });
                            return;
                        }
                        const currentProcessPercentage = Math.ceil(((keywordCrawlerProcess.total - keywordCrawlerProcess.listKeywords.length) / keywordCrawlerProcess.total) * 100);
                        setCrawlerProcessInfo({
                            processPercentage: currentProcessPercentage,
                        });
                    }, intervalTime);
                });
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
            <div className='kw-table-wrapper'>
                <div className='title'>
                    <h4>KWCrawler Info</h4>
                </div>
                <div className='kw-table'>
                    <FileUpload isDisabled={!!crawlerProcessInfo} processData={processData} />
                    <div style={{ display: crawlerProcessInfo ? 'block' : 'none' }}>
                        <KWProgressBar now={crawlerProcessInfo ? crawlerProcessInfo.processPercentage : 0} />
                    </div>
                    <KWTable isLoading={isLoading} columns={tableColumns} data={keywords} />
                </div>
                <div className='kw-pagination-wrapper'>
                    <KWPagination pageInfo={pageInfo} handleChangePage={handleChangePage} />
                </div>
            </div>
        </>
    )
}

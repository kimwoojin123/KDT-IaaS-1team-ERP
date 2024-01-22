'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Slide from './slide';

  interface Product {
    productName: string;
    productKey : number;
    price : number;
  }

  export default function Category() {
    const router = useRouter();
    const [category, setCategory] = useState<string[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedStandard, setSelectedStandard] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [showStandards, setShowStandards] = useState(false);  
    const [categoryStates, setCategoryStates] = useState<{ [key: string]: boolean }>({});
    const [showSlide, setShowSlide] = useState(true); // State to control visibility of Slide

    const standards = ['특', '대', '중', '소'];
    const pageSize = 6;
  
    const visibleProducts = products.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );
    
    const renderPagination = () => {
      const pagination = [];
      const pagesToShow = 5;
    
      const totalPages = Math.ceil(products.length / pageSize);
    
      const renderPageNumbers = (start : number, end :number) => {
        for (let i = start; i <= end; i++) {
          pagination.push(
            <button className="border w-10 h-9 mr-2"key={i} onClick={() => setCurrentPage(i)}>
              {i}
            </button>
          );
        }
      };
    
      if (currentPage > pagesToShow) {
        pagination.push(
          <button key="prev" onClick={() => setCurrentPage(currentPage - pagesToShow)}>
            {'<'}
          </button>
        );
      }
    
      if (currentPage <= totalPages) {
        const startPage = currentPage <= pagesToShow ? 1 : currentPage - ((currentPage - 1) % pagesToShow);
        const endPage = Math.min(startPage + pagesToShow - 1, totalPages);
    
        renderPageNumbers(startPage, endPage);
    
        if (endPage < totalPages) {
          pagination.push(
            <button key="next" onClick={() => setCurrentPage(endPage + 1)}>
              {'>'}
            </button>
          );
        }
      }
    
      return pagination;
    };




    useEffect(() => {
      fetch('/category')
        .then((response) => {
          if (!response.ok) {
            throw new Error('카테고리 데이터를 가져오는 데 문제가 발생했습니다.');
          }
          return response.json();
        })
        .then((data: { cateName: string }[]) => {
          const extractedCategory = data.map((item) => item.cateName);
          setCategory(extractedCategory);
        })
        .catch((error) => {
          console.error('Error fetching category:', error);
        });
    }, []);


    useEffect(() => {
      // Fetch initial products
      fetch('/products')
        .then((response) => {
          if (!response.ok) {
            throw new Error('상품 데이터를 가져오는 데 문제가 발생했습니다.');
          }
          return response.json();
        })
        .then((data) => {
          setProducts(data);
        })
        .catch((error) => {
          console.error('Error fetching products:', error);
        });
    }, []);
  



    const fetchProductsByCategory = (cateName: string) => {
      // Fetch products based on category
      fetch(`/products?cateName=${cateName}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('해당 카테고리의 제품을 가져오는 데 문제가 발생했습니다.');
          }
          return response.json();
        })
        .then((data) => {
          setProducts(data);
          setShowSlide(false)
        })
        .catch((error) => {
          console.error('Error fetching products by category:', error);
        });
    };


    const fetchProductByCategoryAndStandard = (cateName: string, standard: string) => {    
      fetch(`/products?cateName=${cateName}&standard=${standard}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('해당 카테고리별 규격정보를 가져오는데 문제가 발생했습니다.');
          }
          return response.json();
        })
        .then((data) => {
          setProducts(data);
        })
        .catch((error) => {
          console.error('Error fetching', error);
        });
    };
    


    useEffect(() => {
      if (selectedCategory && selectedStandard) {
        fetchProductByCategoryAndStandard(selectedCategory, selectedStandard);
      }
    }, [selectedCategory, selectedStandard]);
  

    const fetchProductDetails = (productKey: number) => {
      fetch(`/productDetails?productKey=${productKey}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('상품 상세 정보를 가져오는 데 문제가 발생했습니다.');
          }
          return response.json();
        })
        .then((data) => {
          const { productName, price, productKey } = data;
          if (productName && price && productKey) {
            router.push(`/productDetail/?productName=${productName}&price=${price}&productKey=${productKey}`);
          } else {
            console.error('Error: productName or price not found in fetched data');
          }
        })
        .catch((error) => {
          console.error('Error fetching product details:', error);
        });
    };



    const handleCategoryMouseOver = (cateName: string) => {
      setCategoryStates((prevStates) => ({ ...prevStates, [cateName]: true }));
      setSelectedCategory(cateName)
      setSelectedStandard(null); // 추가된 부분
    };
    
    const handleCategoryMouseOut = () => {
      setCategoryStates({});
    };


    const handleStandardClick = (standard: string) => {
      setSelectedStandard(standard);
      setShowStandards(false);
    };
  


    const renderStandards = (cateName: string) => {
      const showStandards = categoryStates[cateName];
    
      if (showStandards) {
        return (
          <div className="flex flex-col absolute top-10 w-20 items-center bg-gray-300 pl-2 z-10">
            {standards.map((standard) => (
              <div
                key={standard}
                onClick={() => handleStandardClick(standard)}
                style={{ cursor: 'pointer', marginRight: '10px' }}
              >
                {standard}
              </div>
            ))}
          </div>
        );
      }
      return null;
    };

    return (
      <div>
        <ul className="flex justify-around bg-gray-300">
          {category.map((cateName, index) => (
            <li
              className="relative flex justify-center w-20 h-10 items-center bg-gray-300 hover:bg-slate-200 cursor-pointer"
              key={index}
              onClick={() => fetchProductsByCategory(cateName)}
              onMouseOver={() => handleCategoryMouseOver(cateName)}
              onMouseOut={handleCategoryMouseOut}
              >
              {cateName}
              {renderStandards(cateName)}
            </li>
          ))}
        </ul>
        {showSlide && <Slide />}
        <div className='flex w-lvw justify-center'>
        <ul className='flex flex-wrap items-center justify-center w-1/2 h-lvh'>
          {visibleProducts.map((product, index) => (
            <li className='flex flex-col w-40 h-80 border mr-10 cursor-pointer' key={index} onClick={() => fetchProductDetails(product.productKey)}>
              <div className='h-60 border-b'>
                <img className='w-full h-full object-cover' src={`/${product.productName}.png`} alt={`${index}`} />
              </div>
              <p className='h-20 flex justify-center items-center'>{product.productName}</p>
            </li>
          ))}
        </ul>
        </div>
        <div className="flex pagination justify-center">{renderPagination()}</div>
      </div>
    );
  }
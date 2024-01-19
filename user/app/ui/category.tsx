'use client'

// 'react' 모듈에서 필요한 함수 및 상태 변수들을 가져옵니다.
import { useEffect, useState } from 'react';
// 'next/navigation'에서 라우터 관련 기능을 가져옵니다.
import { useRouter } from 'next/navigation';
import Slide from './slide/page';

// 제품(Product) 인터페이스를 정의합니다.
interface Product {
  productName: string; // 제품 이름
  productKey: number; // 제품 고유 식별자
  price: number; // 제품 가격
}

// Category 컴포넌트를 정의합니다.
export default function Category() {
  // Next.js의 라우터를 가져옵니다.
  const router = useRouter();

  // 상태 변수들을 선언합니다.
  const [category, setCategory] = useState<string[]>([]); // 카테고리 목록을 저장하는 상태
  const [products, setProducts] = useState<Product[]>([]); // 제품 목록을 저장하는 상태
  const pageSize = 6; // 페이지당 보여질 제품 수
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지를 저장하는 상태


  // 현재 페이지에 따라 보여질 제품 목록을 계산합니다.
  const visibleProducts = products.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // 페이징을 렌더링하는 함수입니다.
  const renderPagination = () => {
    const pagination = [];
    const pagesToShow = 5; // 보여질 페이지 수

    const totalPages = Math.ceil(products.length / pageSize);

    const renderPageNumbers = (start: number, end: number) => {
      for (let i = start; i <= end; i++) {
         // 페이지 번호를 나타내는 버튼을 생성하고 클릭 시 해당 페이지로 이동하도록 합니다.
        pagination.push(
          <button
            className="border w-10 h-9 mr-2"
            key={i}
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </button>
        );
      }
    };

    if (currentPage > pagesToShow) {
      pagination.push(
        <button
          key="prev"
          onClick={() => setCurrentPage(currentPage - pagesToShow)}
        >
          {'<'}
        </button>
      );
    }

    if (currentPage <= totalPages) {
      const startPage =
        currentPage <= pagesToShow
          ? 1
          : currentPage - ((currentPage - 1) % pagesToShow);
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

  // 카테고리 데이터를 서버로부터 가져오는 효과입니다.
  useEffect(() => {
    fetch('/category')
      .then((response) => {
        if (!response.ok) {
          throw new Error('카테고리 데이터를 가져오는 데 문제가 발생했습니다.');
        }
        return response.json();
      })
      .then((data: { cateName: string }[]) => {
        // 응답 데이터에서 카테고리명을 추출하여 상태에 설정합니다.
        const extractedCategory = data.map((item) => item.cateName);
        setCategory(extractedCategory);
      })
      .catch((error) => {
        console.error('Error fetching category:', error);
      });
  }, []);

  // 모든 상품 데이터를 초기에 서버로부터 가져오는 효과입니다.
  useEffect(() => {
    fetch('/products')
      .then((response) => {
        if (!response.ok) {
          throw new Error('상품 데이터를 가져오는 데 문제가 발생했습니다.');
        }
        return response.json();
      })
      .then((data) => {
        // 응답 데이터에서 제품 목록을 상태에 설정합니다.
        setProducts(data);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  }, []);

  // 특정 카테고리의 제품을 서버로부터 가져오는 함수입니다.
  const fetchProductsByCategory = (cateName: string) => {
    fetch(`/products?cateName=${cateName}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('해당 카테고리의 제품을 가져오는 데 문제가 발생했습니다.');
        }
        return response.json();
      })
      .then((data) => {
        // 응답 데이터에서 제품 목록을 상태에 설정합니다.
        setProducts(data);
      })
      .catch((error) => {
        console.error('Error fetching products by category:', error);
      });
  };

  // 특정 제품의 상세 정보를 서버로부터 가져오고 라우팅을 수행하는 함수입니다.
  const fetchProductDetails = (productKey: number) => {
    fetch(`/productDetails?productKey=${productKey}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('상품 상세 정보를 가져오는 데 문제가 발생했습니다.');
        }
        return response.json();
      })
      .then((data) => {
        // 응답 데이터에서 제품 정보를 추출합니다.
        const { productName, price, productKey } = data;
        if (productName && price && productKey) {
          // 라우터를 사용하여 상품 상세 페이지로 이동합니다.
          router.push(
            `/productDetail/?productName=${productName}&price=${price}&productKey=${productKey}`
          );
        } else {
          console.error(
            'Error: productName or price not found in fetched data'
          );
        }
      })
      .catch((error) => {
        console.error('Error fetching product details:', error);
      });
  };

  // 컴포넌트를 렌더링합니다.
return (
  <div>
    {/* 카테고리 목록을 나타내는 UI */}
    <ul className="flex justify-around bg-gray-300">
      {category.map((cateName, index) => (
        <li
          className="flex justify-center w-20 h-10 items-center bg-gray-300 hover:bg-slate-200 cursor-pointer transition"
          key={index}
          onClick={() => fetchProductsByCategory(cateName)}
        >
          {cateName}
        </li>
      ))}
    </ul>

        <Slide/>
    {/* 제품 목록을 나타내는 UI */}
    <div className="flex w-full justify-center overflow-x-auto bg-gray-100 py-4">
      <ul className="flex flex-nowrap">
        {visibleProducts.map((product, index) => (
          <li
            className="flex flex-col w-40 h-80 border mr-10 cursor-pointer"
            key={index}
            onClick={() => fetchProductDetails(product.productKey)}
          >
            <div className="h-60 border-b">
              {/* 제품 이미지를 나타내는 UI */}
              <img
                className="w-full h-full object-cover"
                src={`/${product.productName}.png`}
                alt={`${index}`}
              />
            </div>
            {/* 제품 이름을 나타내는 UI */}
            <p className="h-20 flex justify-center items-center">
              {product.productName}
            </p>
          </li>
        ))}
      </ul>
    </div>

    {/* 페이징 UI를 나타내는 부분 */}
    <div className="flex pagination justify-center">
      {renderPagination()}
    </div>
  </div>
);}
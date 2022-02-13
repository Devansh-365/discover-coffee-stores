import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router"
import {fetchCoffeeStores} from "../../lib/coffee-stores"
import styles from "../../styles/coffee-store.module.css"
import cls from "classnames"

export async function getStaticProps(staticProps) {
    const params = staticProps.params
    let coffeeStoresData = await fetchCoffeeStores();
    console.log("coffeeStores", coffeeStoresData)
    return {
        props: {
            coffeStores: coffeeStoresData.find((coffeStore) => {
                return coffeStore.id.toString() === params.id;
            })
        }
    }
}

export async function getStaticPaths() {
    let coffeeStoresData = await fetchCoffeeStores();
    const paths = coffeeStoresData.map((coffeStore) => {
        return {
            params: {
                id: coffeStore.id.toString(),
            },
        }
    });

    return {
      paths,
      fallback: true, // false or 'blocking'
    };
  }
  

const DynamicRoute = (props) => {

    const router = useRouter();

    if(router.isFallback) {
        return(
            <div>Loading..</div>
        )
    }

    const {location, name, imgUrl} = props.coffeStores

    const handleUpvoteButton = () => {
        console.log("You Click Upvote!!!")
    }

    return (
        <div className={styles.layout}>
            <Head><title>{name}</title></Head>
            <div className={styles.container}>
                <div className={styles.col1}>
                    <div className={styles.backToHomeLink}>
                        <Link href='/'>
                            <a>← Back to home</a>
                        </Link>
                    </div>
                    <div className={styles.nameWrapper}>
                        <h1 className={styles.name}>{name}</h1>
                    </div>
                    <Image src={imgUrl || "https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80"} width={600} height={360} alt={name} className={styles.storeImg} />
                </div>
                <div className={cls("glass",styles.col2)}>
                    <div className={styles.iconWrapper}>
                        <Image src="/static/icons/places.svg" width={24} height={24} />
                        <p className={styles.text}>{location.address}</p>
                    </div>
                    {location.neighborhood && <div className={styles.iconWrapper}>
                        <Image src="/static/icons/nearMe.svg" width={24} height={24} />
                        <p className={styles.text}>{location.neighborhood}</p>
                    </div>}
                    <div className={styles.iconWrapper}>
                        <Image src="/static/icons/star.svg" width={24} height={24} />
                        <p className={styles.text}>1</p>
                    </div>
                    <button className={styles.upvoteButton} onClick={handleUpvoteButton} >
                        Up vote!
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DynamicRoute
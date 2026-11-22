import {groups} from '../data/catalog';
import {Logo} from './UI';
export default function Footer(){return <footer><div className="footer-grid"><Logo footer/><div><span className="eyebrow">Explore</span><a href="/services.html">All services</a>{groups.map(g=><a key={g.id} href={`/services.html#${g.id}`}>{g.name}</a>)}</div><div><span className="eyebrow">Get to know us</span><a href="/about.html">About</a><a href="/contact.html">Contact</a></div></div><div className="footer-bottom">© {new Date().getFullYear()} CorpBridge</div></footer>;}

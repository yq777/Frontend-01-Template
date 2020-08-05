import { createElement, Text, Wrapper } from './createElement';
import { Carousel } from './Carousel';
import { TabPanel } from './Panel';
import { ListView } from './ListView';
let component = (
  <Carousel
    data={[
      'https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg',
      'https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg',
      'https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg',
      'https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg',
    ]}
  />
);

let data = [
  {
    title: '蓝猫',
    url:
      'https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg',
  },
  {
    title: '橘猫加白',
    url:
      'https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg',
  },
  {
    title: '狸花加白',
    url:
      'https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg',
  },
  {
    title: '橘猫',
    url:
      'https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg',
  },
];

let panel = (
  <TabPanel>
    <div title='test1'>test</div>
    <div title='test2'>test2</div>
    <div title='test3'>test3</div>
    <div title='test4'>test4</div>
    <div title='test5'>test5</div>
  </TabPanel>
);

let list = (
  <ListView data={data}>
    {(record) => (
      <figure>
        <img src={record.url} />
        <figcaption>{record.title}</figcaption>
      </figure>
    )}
  </ListView>
);

component.mountTo(document.body);

panel.mountTo(document.body);

list.mountTo(document.body);

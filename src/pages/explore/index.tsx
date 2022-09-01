import type { NextPage } from 'next';
import { Gap, Title } from '@components/atoms';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

const Explore: NextPage = () => {
  const handleTabs = () => {};

  return (
    <div>
      <div className="w-full h-screen flex justify-start">
        <main className="w-full h-full flex flex-col p-14">
          <Title
            type="title-content"
            text="Explore collections"
            className="h-20 flex items-center text-5xl font-extrabold"
          />
          <div className="w-full h-full">
            <Tabs
              defaultActiveKey="1"
              onChange={handleTabs}
              className="w-full h-full text-base font-semibold"
            >
              <TabPane tab="All" key="1">
                <div className="w-full h-full">
                  <ul className="w-full h-full flex flex-wrap justify-evenly items-start">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(() => (
                      <li className="shadow rounded-md w-72 h-52 mb-5">
                        <div>mainimg</div>
                        <div>
                          <div>profile</div>
                          <div>title</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabPane>
              <TabPane tab="Trending" key="2">
                Content of Tab Pane 1
              </TabPane>
              <TabPane tab="Top" key="3">
                Content of Tab Pane 2
              </TabPane>
              <TabPane tab="Art" key="4">
                Content of Tab Pane 3
              </TabPane>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Explore;

import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { MenuIcon, BellIcon, UserIcon, ChevronDownIcon, Building } from 'lucide-react';
import { useBuildings } from '@/contexts/BuildingsContext';
import { Link } from 'react-router-dom';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  pageTitle: string;
}

export default function Header({ sidebarOpen, setSidebarOpen, pageTitle }: HeaderProps) {
  const { selectedBuilding, buildings, setSelectedBuilding } = useBuildings();

  return (
    <header className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow">
      <button
        type="button"
        className="md:hidden px-4 text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <span className="sr-only">Open sidebar</span>
        <MenuIcon className="h-6 w-6" aria-hidden="true" />
      </button>

      <div className="flex flex-1 justify-between px-4 md:px-6">
        <div className="flex flex-1 items-center">
          <h1 className="text-2xl font-semibold text-neutral-900">{pageTitle}</h1>
        </div>
        <div className="ml-4 flex items-center gap-4 md:ml-6">
          {buildings.length > 0 && (
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center rounded-md bg-white px-3 py-2 text-sm font-medium text-neutral-700 shadow-sm ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50">
                <Building className="mr-2 h-5 w-5 text-primary" />
                {selectedBuilding ? selectedBuilding.name : 'Select Building'}
                <ChevronDownIcon className="ml-2 -mr-1 h-5 w-5 text-neutral-400" aria-hidden="true" />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {buildings.map((building) => (
                      <Menu.Item key={building.id}>
                        {({ active }) => (
                          <button
                            onClick={() => setSelectedBuilding(building)}
                            className={`${
                              active ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-700'
                            } block w-full text-left px-4 py-2 text-sm`}
                          >
                            {building.name}
                          </button>
                        )}
                      </Menu.Item>
                    ))}
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/buildings"
                          className={`${
                            active ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-700'
                          } block w-full text-left px-4 py-2 text-sm border-t border-neutral-100`}
                        >
                          Manage Buildings
                        </Link>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          )}

          <button
            type="button"
            className="rounded-full bg-white p-1 text-neutral-400 hover:text-neutral-500"
          >
            <span className="sr-only">View notifications</span>
            <BellIcon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Profile dropdown */}
          <Menu as="div" className="relative ml-3">
            <div>
              <Menu.Button className="flex items-center max-w-xs rounded-full bg-white text-sm focus:outline-none">
                <span className="sr-only">Open user menu</span>
                <div className="flex items-center">
                  <div className="rounded-full bg-neutral-100 p-1">
                    <UserIcon className="h-6 w-6 text-neutral-600" />
                  </div>
                </div>
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={`${
                        active ? 'bg-neutral-100' : ''
                      } block px-4 py-2 text-sm text-neutral-700`}
                    >
                      Your Profile
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={`${
                        active ? 'bg-neutral-100' : ''
                      } block px-4 py-2 text-sm text-neutral-700`}
                    >
                      Settings
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={`${
                        active ? 'bg-neutral-100' : ''
                      } block px-4 py-2 text-sm text-neutral-700`}
                    >
                      Sign out
                    </a>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </header>
  );
}
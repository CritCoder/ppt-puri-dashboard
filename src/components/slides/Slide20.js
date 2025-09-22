import Slide from '../Slide';

const Slide20 = ({ isActive }) => {
  return (
    <Slide isActive={isActive}>
      <div className="relative h-full w-full bg-[#0a0a0a] overflow-hidden">
        <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Dashboard Preview</h2>
            <p className="text-gray-400">Jagannath Puri Analytics Dashboard</p>
            <div className="mt-8 text-sm text-gray-500">
              Dashboard URL: External service integration
            </div>
          </div>
        </div>
      </div>
    </Slide>
  );
};

export default Slide20; 